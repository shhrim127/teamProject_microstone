from celery import Celery
from kombu import Queue 
from flask import Flask
from dotenv import load_dotenv

# tasks 모듈 가져오기


load_dotenv()

def make_celery(app):
    celery = Celery(
        "main",
        broker='redis://localhost:6379/0',
        backend='redis://localhost:6379/0',
        include=[
                'module.celery_tasks.tasks',
                'module.celery_tasks.base'
                ]  # tasks 모듈 포함
    )
    
    # 4개의 큐 설정
    celery.conf.task_queues = (
        Queue('PDF_queue'),
        Queue('OCR_queue', rate_limit='1/s'), 
        Queue('GPT_queue', rate_limit='300/m'), 
        Queue('default_queue')
    )

    celery.conf.update(
        task_routes={
            'module.celery_tasks.tasks.process_pdf': {'queue': 'PDF_queue'},
            'module.celery_tasks.tasks.clova_ocr': {'queue': 'OCR_queue'},
            'module.celery_tasks.tasks.openAI_gpt': {'queue': 'GPT_queue'},
            'module.celery_tasks.tasks.Text_to_markdown': {'queue': 'GPT_queue'},
            'module.celery_tasks.tasks.save_result': {'queue': 'default_queue'},
            
            'module.celery_tasks.tasks.create_questions': {'queue': 'GPT_queue'},

            'module.celery_tasks.base.UpdateStateTask': {'queue': 'default_queue'},
        }
    )

    # 기본 큐 설정 (지정되지 않은 작업은 이 큐로 이동)
    celery.conf.task_default_queue = 'default_queue'

    # 기타 필요한 설정을 업데이트
    celery.conf.update(app.config)
    
    # Flask의 애플리케이션 컨텍스트 내에서 Celery 작업 실행을 보장
    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery

# Flask 애플리케이션 생성
app = Flask(__name__)
app.config.update(
    result_backend='redis://localhost:6379/0',
    broker_url='redis://localhost:6379/0'
)

# Celery 애플리케이션 생성
celery = make_celery(app)

