import os
import requests
from dotenv import load_dotenv
from .base import baseTask

import uuid
import time
import json

# .env 파일에서 환경 변수 로드
load_dotenv()

class ClovaOCRClient(baseTask):
    def __init__(self):
        self.progress_key = "ocr_progress"
        self.api_key = os.getenv("CLOVA_OCR_SECRET_KEY")
        self.api_url = os.getenv("CLOVA_OCR_API")
        
    # def __call__(self, *args, **kwargs):
    #     return self.ocr_request(*args, **kwargs)
    
    def ocr_request(self, image_path, format='png'):
        is_url = image_path.startswith("http://") or image_path.startswith("https://")
        
        request_json = {
            'images': [
                {
                    'format': format,
                    'name': 'test',
                }
            ],
            "lang": "ko",
            "requestId": f"{uuid.uuid4()}",
            "resultType": "string",
            "version": 'V2',
            "timestamp": int(round(time.time() * 1000))
        }
        
        headers = {
            'X-OCR-SECRET': self.api_key
        }
        try:
            if is_url:
                headers['Content-Type'] = 'application/json'
                request_json['images'][0]['url'] = image_path
                data = json.dumps(request_json).encode('UTF-8')
                response = requests.post(self.api_url, headers=headers, data=data)
            else:
                files = [
                    ('file', open(image_path,'rb'))
                    ]
                data = {'message': json.dumps(request_json)}
                response = requests.post(self.api_url, headers=headers, files=files, data=data)

            response.raise_for_status()  # 상태 코드가 200이 아니면 예외 발생
            ocr_result = response.json()
            return self.parse_ocr_result(ocr_result)
        except Exception as e:
            print(f"Error during OCR request: {e}")
            raise

    def parse_ocr_result(self, ocr_result):
        try:
            lines = []
            current_line = []
            last_y = None

            for image in ocr_result.get('images', []):
                fields = image.get('fields', [])
                for field in fields:
                    text = field.get('inferText', '')
                    y = field.get('boundingPoly', {}).get('vertices', [{}])[0].get('y', 0)

                    if last_y is not None and abs(y - last_y) > 10:  # 10은 임의의 임계값
                        lines.append(" ".join(current_line))
                        current_line = []

                    current_line.append(text)
                    last_y = y

                if current_line:
                    lines.append(" ".join(current_line))

            return "\n".join(lines)
        except Exception as e:
            print(f"Error during OCR result parsing: {e}")
            return None
