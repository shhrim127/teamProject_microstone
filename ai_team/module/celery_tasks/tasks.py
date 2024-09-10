from celery_app import celery
from .llm_core import OpenAIVision,OpenAICreateQuestions,OpenAITextToMarkdown
from .ocr_core import ClovaOCRClient
from .PDF_to_JPG import pdf_to_images
from celery import group, chain
from .base import baseTask
import shutil
import os

@celery.task(bind=True)
def process_pdf(self, pdf_path):
    self.update_state(state='STARTED', meta={
        'ocr_progress': 0,
        'gpt_progress': 0,
        'total_image': 0,
    })

    image_local_urls = pdf_to_images(pdf_path, f"./data/{self.request.id}")
    
    self.update_state(state='PROGRESS', meta={
        'ocr_progress': 0,
        'gpt_progress': 0,
        'total_image': len(image_local_urls),
    })

    task = group(
        chain(
            clova_ocr.s(image_url),  # OCR 작업은 OCR_queue로
            #openAI_gpt.s(image_url), # GPT 작업은 GPT_queue로
            save_result.s(task_number, self.request.id)  # 결과 저장은 default_queue로
        ) for task_number, image_url in enumerate(image_local_urls, start=1)
    )

    result = task.apply_async()
    result.join()
    finalize_results(result.get(), self.request.id)
    shutil.rmtree(f"./data/{self.request.id}")
    result = Text_to_markdown.apply_async(args=[self.request.id])
    result.get()
    os.remove(f"./data/{self.request.id}.txt")
    return {"file_uuid": str(self.request.id), "status": "Completed"}


@celery.task(bind=True,base=ClovaOCRClient)
def clova_ocr(self,image_url):
    return self.ocr_request(image_path=image_url)

@celery.task(bind=True,base=OpenAITextToMarkdown)
def Text_to_markdown(self,file_uuid):
    return self.invoke()

# @celery.task(bind=True,base=OpenAIVision,priority=100)
# def openAI_gpt(self,ocr_text, image_url,**kwargs):
#     kwargs['priority'] = 100
#     return self.invoke(image_url=image_url, user_prompt=ocr_text)

@celery.task(bind=True,base=baseTask)
def save_result(self,result, task_number, file_uuid):
    output_dir = f"{os.getenv('IMAGE_FOLDER')}{file_uuid}/tmp"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    result_filepath = f"{output_dir}/page_{task_number}.txt"
    with open(result_filepath, 'w',encoding='utf-8') as f:  
        f.write(result)
    #print(f"Result for task {task_number} saved to {result_filepath}")
    return task_number, result_filepath

@celery.task(bind=True,base=OpenAICreateQuestions,priority=20)
def create_questions(self,uuid_path,**kwargs):
    kwargs['priority'] = 20
    return self.invoke()

def finalize_results(order_file_list, file_uuid):
        final_output_file = f"{os.getenv('IMAGE_FOLDER')}{file_uuid}.txt"
        sorted_list = sorted(order_file_list, key=lambda x: x[0])

        with open(final_output_file, 'w',encoding='utf-8') as final_file:
            for task_number, result_filepath in sorted_list:
                with open(result_filepath, 'r',encoding='utf-8') as f:
                    final_file.write(f.read())