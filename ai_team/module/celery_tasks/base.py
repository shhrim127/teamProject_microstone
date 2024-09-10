from celery import Task
from abc import ABC
from celery_app import celery
from module.celery_tasks import token_bucket_instance
import time

class baseTask(Task,ABC):
    def __init__(self) -> None:
        super().__init__()
        self.progress_key = None
    def on_success(self, retval, task_id, args, kwargs):
        if self.progress_key is not None:
            self.update_state_task()
    def update_state_task(self,progress_key=None):
        if progress_key is None:
            progress_key = self.progress_key
        UpdateStateTask.apply_async(args=[self.request.root_id, progress_key])

class baseLLMTask(baseTask):
    def __init__(self) -> None:
        super().__init__()
        self.response = None
        
        self.consume_total_token = None
        self.total_token = None
        
    def __call__(self, *args, **kwargs):
        self.consume_total_token = kwargs['consume_total_token'] 
        # 토큰이 충분할 때까지 대기
        count = 0
        while not token_bucket_instance.can_consume(self.consume_total_token):
            count +=1
            #print(f"Not enough tokens for task. Waiting...{count} sec")
            time.sleep(1)
            
        #print(f"Processing allowed task")
        return super().__call__(*args, **kwargs)
        
    def after_return(self, status, retval, task_id, args, kwargs, einfo):

        #print(f"오류 필수확인 : {self.consume_total_token} / {self.total_token}")
        time.sleep(60)
        #60초후에 소비한 토큰을 추가합니다.
        token_bucket_instance.add_tokens(kwargs['consume_total_token'] )
        
    def invoke(self,model,prompt):
        chain =  prompt | model
        self.response = chain.invoke()
        content = self.response
        return content
    
    def create_prompt(self):
        return self.prompt

    def create_model(self):
        return self.model | self.parser

@celery.task(bind=True)
def UpdateStateTask(self,parent_task_id, progress_key):
    parent_task = self.AsyncResult(parent_task_id)
    current_meta = parent_task.info or {}
    
    current_progress = current_meta.get(progress_key, 0) + 1
    current_meta[progress_key] = current_progress

    ocr_progress = current_meta.get('ocr_progress', 0)
    gpt_progress = current_meta.get('gpt_progress', 0)
    total_images = current_meta.get('total_image', 1)

    total_progress = ((ocr_progress + gpt_progress) / (2 * total_images)) * 100
    current_meta['total_status'] = total_progress

    self.update_state(task_id=parent_task_id, state='PROGRESS', meta=current_meta)

