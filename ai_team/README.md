# 1. OCR 및 LLM을 활용한 데이터 전처리
## 1.1. 응용서버 요청
- **요청 형식**: `POST`
- **받아들이는 형식**: `JSON`
- **필수 필드**: 파일 경로

## 1.2. PDF 파일을 페이지별로 이미지로 저장
- **폴더명**: UUID
- **이미지명**: `page_{num}.png`

## 1.3. OCR을 사용하여 텍스트 추출
- **OCR API 모델** : 클로바 OCR
- **처리방식** : `celery`로 비동기처리
- **매게변수** : 이미지 (**바이너리코드 인코딩** 또는 URL)
- **요구 사항**:
    - 1초당 1번 요청 가능(1 TPS)
    - 한번에 최대 처리 5개의 요청 처리(API 문제)

## 1.4. LLM를 이용해 텍스트와 이미지를 마크다운 형식으로 전처리 요청
- **LLM API 모델** : gpt-4o
- **처리방식** : `celery`로 비동기처리
- **매게변수** : 이미지(**base64 인코딩** 또는 URL) , OCR 텍스트
- **요구사항**:
    - 30000 TPM (1분당 최대 30000개의 토큰 처리)
    - 500 RPM (1분당 최대 500개의 요청 처리)
- **저장**:
    - 페이지별로 저장
    - 저장 방식 : `txt`
    - 폴더위치 :  `./data/{UUID}/tmp`
    - 파일이름 : `page_{num}.txt`
## 1.5. `txt` 파일을 순서에 맞게 저장
- **정렬 기준** : 페이지 번호에 따라 배열 정렬
- **저장**
    - **저장 위치** : `./data`
    - **저장 형식** : 마크다운(md)
## 1.6. 반환값
- **반환** : UUID 
- UUID 폴더삭제

# 2. RAG활용하여 ChatGPT에게 문제를 생성한다.
1. 응용서버 요청
    - **요청 방식**: `POST`
    - **받아들이는 형식**: `JSON`
    - **반드시 있어야 하는 메소드**: 마크다운 파일 경로

2. 경로를 이용해 파일 읽기
    - **주의**: 랭체인에서 내장된 함수는 없음

3. 문서 분할

4. 임베딩 생성
    - **임베딩 함수**: `OpenAIEmbeddings` 사용

5. 벡터DB 설정
    - **벡터DB**: `ChromaDB` 사용
    - **저장 여부**: 저장하지 않음

6. 프롬프트 선택

7. 언어 모델 생성
    - **기본 모델**: `gpt-4o` 사용

8. 체인을 통해 질의 처리

9. 응용서버에 결과 전달
    - **전달 방식**: `POST`
    - **전달 형식**: `JSON`

# 3. 설치
- python = 3.11
- RestAPI : Flask
- Celery (비동기 큐)
- Redis (메세지 브로커)
```bash
conda create --name microstone python=3.11
conda activate microstone
pip install -r https://raw.githubusercontent.com/teddylee777/langchain-kr/main/requirements.txt
pip install Flask celery redis gevent Waitress flower rake_nltk
```

# 4. Celery 실행
현재 윈도우에서는 `celery multi` 명령어가 지원되지 않으므로, 개별 `worker`를 수동으로 실행해야 합니다. 이를 위해 `start_celery.bat` 스크립트를 준비했으며, 해당 스크립트를 실행하면 자동으로 `Celery` 작업자가 실행됩니다. 또한, 이 스크립트는 `Flask` 서버까지 자동으로 실행되도록 설정되어 있습니다.

## `Celery`의 윈도우 지원 종료 및 `Gevent` 사용
`Celery`는 윈도우 지원이 공식적으로 중단되었기 때문에, 윈도우 환경에서는 `Gevent`를 활용하여 비동기 작업을 처리합니다. `Gevent`는 비동기 I/O를 지원하는 파이썬 라이브러리로, `Celery`와 함께 사용하여 효율적인 비동기 작업 처리가 가능합니다.

## Celery + Redis의 도입 이유
백그라운드 작업을 효율적으로 처리하기 위해 Celery와 Redis를 사용합니다. Celery는 작업을 분산 처리할 수 있는 강력한 도구이며, Redis는 이와 결합하여 빠르고 신뢰성 있는 메시지 브로커 역할을 합니다.

# 5. Redis 설치
Redis는 Celery의 메시지 브로커로 사용됩니다. Redis 설치를 위해 아래 링크를 통해 다운로드하세요:
- [Redis 다운로드 링크](https://github.com/microsoftarchive/redis/releases)

# 6. Flower
Celery 작업을 모니터링함
```bash
celery -A celery_app.celery flower --address=localhost --port=5555
```
# 7. Waitress WSGI 서버 실행
```bash
waitress-serve --listen=127.0.0.1:5000 main:app
```


