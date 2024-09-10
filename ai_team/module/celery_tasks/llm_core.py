
import os
import base64
import random
import requests
import tiktoken
from rake_nltk import Rake
from konlpy.tag import Komoran
from operator import itemgetter
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate,PromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.text_splitter import RecursiveCharacterTextSplitter,TokenTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_core.runnables import RunnablePassthrough

from langchain_openai import ChatOpenAI
from module.celery_tasks.base import baseLLMTask,baseTask
from module.document_loaders.markdown_loaders import MarkdownLoader
from module.celery_tasks.utile import count_tokens,count_image_tokens
from config import MODEL_CONFIG,CREATE_MODEL

load_dotenv()

class OpenAIVision(baseLLMTask):
    def __init__(self):
        super().__init__()
        self.progress_key = "gpt_progress"
        self.model = ChatOpenAI(model_name=MODEL_CONFIG.MODEL, temperature=MODEL_CONFIG.TEMPERATURE)
        #self.parser = MODEL_CONFIG.PARSER
        self.system_prompt = MODEL_CONFIG.SYSTEM_PROMPT

        self.user_prompt = None
        self.image_url = None
    
    def create_prompt(self,image_url, user_prompt):
        encoded_image = self.encode_image(image_url)
        self.prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=[
                {"type": "text", "text": user_prompt},
                {   "type": "image_url", 
                    "image_url": {
                        "url": encoded_image,
                    }
                }
            ])
        ])
        return self.prompt
    
    def apply_async(self, args=None, kwargs=None, task_id=None, producer=None, link=None, link_error=None, shadow=None, **options):
        self.user_prompt = args[0] #ocr_text 값을 입력받음
        self.image_url = args[1] #이미지 url을 입력받음
        prompt_token = [
            {
                "role": "system",
                "content": self.system_prompt,
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": self.user_prompt,
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": ""},
                    },
                ],
            },
        ]
        self.consume_total_token = count_image_tokens(self.image_url) +  (count_tokens(str(prompt_token)) * 2) + 200 # 보수적이게 관리하게 위해 토큰 추가
        kwargs['consume_total_token'] = self.consume_total_token
        #print(f"total token : {self.consume_total_token}")
        return super().apply_async(args, kwargs, task_id, producer, link, link_error, shadow, **options)

    # 이미지를 base64로 인코딩하는 함수 (URL)
    def encode_image_from_url(self, url):
        response = requests.get(url)
        if response.status_code == 200:
            image_content = response.content
            if url.lower().endswith((".jpg", ".jpeg")):
                mime_type = "image/jpeg"
            elif url.lower().endswith(".png"):
                mime_type = "image/png"
            else:
                mime_type = "image/unknown"
            return f"data:{mime_type};base64,{base64.b64encode(image_content).decode('utf-8')}"
        else:
            raise Exception("Failed to download image")

    # 이미지를 base64로 인코딩하는 함수 (파일)
    def encode_image_from_file(self, file_path):
        with open(file_path, "rb") as image_file:
            image_content = image_file.read()
            file_ext = os.path.splitext(file_path)[1].lower()
            if file_ext in [".jpg", ".jpeg"]:
                mime_type = "image/jpeg"
            elif file_ext == ".png":
                mime_type = "image/png"
            else:
                mime_type = "image/unknown"
            return f"data:{mime_type};base64,{base64.b64encode(image_content).decode('utf-8')}"

    def encode_image(self, image_path):
        if image_path.startswith("http://") or image_path.startswith("https://"):
            return self.encode_image_from_url(image_path)
        else:
            return self.encode_image_from_file(image_path)

    def invoke(self, image_url, user_prompt):
        self.create_prompt(image_url, user_prompt)
        chain = self.prompt | self.model
        self.response = chain.invoke({})
        
        content = self.response.content
        self.total_token = self.response.response_metadata['token_usage']['total_tokens']

        return content

class OpenAITextToMarkdown(baseTask):
    def __init__(self) -> None:
        super().__init__()
        self.model = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)
        self.parser = MODEL_CONFIG.PARSER
        self.embeddings = CREATE_MODEL.EMBEDDINGS
        self.encoding = tiktoken.encoding_for_model("gpt-4o-mini") 

    def loader_document(self, uuid_path):
        # with 구문을 사용해 파일 내용 읽기data\102774e9-831a-41c2-93db-e61443867b82.md
        with open(f"./data/{uuid_path}.txt", 'r', encoding='utf-8') as file:
            document_content = file.read()
            text_splitter = TokenTextSplitter(
                chunk_size=5000,  # 청크 크기 설정
                chunk_overlap=100,  # 청크 간 중복 설정
            )
            # 파일 내용을 청크 단위로 나누기
            self.texts = text_splitter.split_text(document_content)
    
    def create_prompt(self):
        prompt = PromptTemplate(
            input_variables=["ocr_text","history"],  
            template="""
                다음은 OCR로 추출된 텍스트입니다. 불필요한 내용이나 단어는 제거하고, 가능한 원본 형식을 유지하여 마크다운으로 변환해 주세요:
                ---
                {ocr_text}
                ---

                아래는 이전에 완료된 작업입니다. 이어서 변환 작업을 진행해 주세요:
                ---
                {history}
                ---

                변환 규칙:
                1. 제목(`Heading`)은 '#', '##', '###' 형식으로 변환해 주세요.
                2. 번호가 있는 목록은 '1.', '2.', '3.' 형식으로, 번호가 없는 목록은 `-` 기호로 변환해 주세요.
                3. 강조는 *기울임* 또는 **굵게** 처리해 주세요.
                4. 인용문은 '>' 기호로 변환해 주세요.
                5. 코드 블록은 "```"로 감싸 주세요.
                6. 그림 설명과 관련된 내용은 삭제해 주세요.
                7. 전체 텍스트를 "```markdown"으로 묶지 말고, 코드 블록만 "```"로 감싸 주세요.

                결과물은 마크다운 형식으로 작성해 주세요.
            """
        )
        return prompt
    
    def before_start(self, task_id, args, kwargs):
        self.uuid_path = args[0]
        self.loader_document(self.uuid_path)
        return super().before_start(task_id, args, kwargs)
    
    def invoke(self):
        # 전체 응답을 저장할 리스트
        all_responses = ""
        prompt = self.create_prompt()

        # 청크별로 AI에 요청
        for idx, text_chunk in enumerate(self.texts):
            history_tokens = self.encoding.encode(all_responses)  # 전체 응답을 토큰화
            if len(history_tokens) > 6000:
                history_tokens = history_tokens[-6000:]  # 마지막 6000 토큰만 가져오기
            history_text = self.encoding.decode(history_tokens)
            
            # 메모리 히스토리 2개를 포함하여 AI에게 요청
            chain = (
                {"ocr_text": itemgetter("ocr_text"),"history":itemgetter("history")}|
                prompt |
                self.model | 
                MODEL_CONFIG.PARSER
            )
            response = chain.invoke({"ocr_text":text_chunk,"history":history_text})

            # 응답 저장
            all_responses += response
            self.save_markdown(response)
            self.update_state_task(progress_key="gpt_progress")
            # 토큰 사용량 확인 (필요시)
            # self.total_token = self.response.response_metadata['token_usage']['total_tokens']
    
    def save_markdown(self, responses):
        # 기존 파일을 덮어쓰고, 각 응답을 개별로 기록
        with open(f"./data/{self.uuid_path}.md", "a", encoding="utf-8") as f:
            f.write(responses)
            f.write("\n\n")

class OpenAICreateQuestions(baseTask):
    def __init__(self) -> None:
        super().__init__()
        self.model = ChatOpenAI(model_name=CREATE_MODEL.MODEL, temperature=CREATE_MODEL.TEMPERATURE)
        #self.parser = CREATE_MODEL.PARSER
        self.embeddings = CREATE_MODEL.EMBEDDINGS
        self.key_words = None
        self.title = None
        self.rake = Rake()

    def loader_document(self, uuid_path):
        """
            - 마크다운 문서를 로드
            uuid : 파일이름 선택하기 위해서 필요

            markdown_document : 문서 전체
            markdown_section : 문서중 랜덤으로 범위 선택
        """
        loader = MarkdownLoader(uuid=uuid_path)
        markdown_document = loader.load()
        # 랜덤으로 문제를 생성할 섹션 고르기
        markdown_section = random.choice(markdown_document)
        return markdown_document,markdown_section
    
    def extract_keywords(self, document):
        # Komoran 객체 생성
        komoran = Komoran()
        
        # 명사 추출
        nouns = komoran.nouns(document.page_content)
        processed_text = ' '.join(nouns)
        # RAKE를 이용해 키워드 추출
        self.rake.extract_keywords_from_text(processed_text)
        self.key_words = self.rake.get_ranked_phrases()[0].split()

    def create_retriever(self,uuid_path):
        markdown_document, markdown_section = self.loader_document(uuid_path)
        self.title = '/'.join(markdown_section.metadata.values())

        self.extract_keywords(markdown_section)

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=CREATE_MODEL.CHUNK_SIZE, chunk_overlap=CREATE_MODEL.CHUNK_OVERLAP
        )
        markdown_document_split = text_splitter.split_documents(markdown_document)
        markdown_section_split = text_splitter.split_documents([markdown_section])

        document_vectorstore = Chroma.from_documents(documents=markdown_document_split, embedding=self.embeddings)
        section_vectorstore = Chroma.from_documents(documents=markdown_section_split, embedding=self.embeddings)
        document_retriever = document_vectorstore.as_retriever()
        section_retriever = section_vectorstore.as_retriever()
        return document_retriever,section_retriever
    
    def create_prompt(self,section_retriever,document_retriever):
        self.prompt = (
            {
                "section_retriever": itemgetter("kward") |section_retriever,  # 검색기 객체
                "document_retriever": itemgetter("kward") | document_retriever,  # 검색기 객체
                "topic": itemgetter("topic"),  # 입력을 그대로 전달
                "kward": itemgetter("kward")  # key_word를 나중에 전달
            } |
            CREATE_MODEL.PROMPT
        )
        return self.prompt
    
    def before_start(self, task_id, args, kwargs):
        uuid_path = args[0]
        document_retriever,section_retriever = self.create_retriever(uuid_path)
        self.create_prompt(document_retriever,section_retriever)
        return super().before_start(task_id, args, kwargs)
    
    def invoke(self):
        chain = self.prompt | self.model 
        key_word = random.choice(self.key_words[:100])
        self.response = chain.invoke({"topic":self.title,"kward":key_word})
        content = self.response.content
        self.total_token = self.response.response_metadata['token_usage']['total_tokens']
        return content

