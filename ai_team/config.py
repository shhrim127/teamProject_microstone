from langchain_core.output_parsers import JsonOutputParser,StrOutputParser
from langchain_openai import OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate,PromptTemplate

class MODEL_CONFIG():
    MODEL = "gpt-4o"
    TEMPERATURE = 0
    PARSER = StrOutputParser()
    SYSTEM_PROMPT = """다음은 원본 이미지에서 OCR로 추출된 텍스트입니다. 이 텍스트를 정리하고, 불필요한 부분을 제거한 후 마크다운 형식으로 변환해주세요. 원본 이미지도 참조하면서, 필요한 경우 이미지에 대한 설명도 추가해 주세요.
                ### 지시사항:
                1. OCR된 텍스트에서 불필요한 공백, 잘못된 단어, 중복된 내용 등을 제거하세요.
                2. 텍스트를 논리적인 구조로 정리하세요. 제목, 소제목, 리스트, 코드 블록 등을 사용하여 텍스트를 마크다운 형식으로 변환하세요.
                3. 텍스트의 의미를 명확하게 하도록 필요한 경우 이미지에 대한 설명을 추가하세요.
                4. 최종 결과물을 다음과 같은 마크다운 형식으로 반환하세요:

                # 제목

                텍스트 내용

                ## 소제목

                - 리스트 항목 1
                - 리스트 항목 2

                기타 텍스트
    """

class LOADER:
    HEADERS_TO_SPLIT_ON = [  # 문서를 분할할 헤더 레벨과 해당 레벨의 이름을 정의합니다.
        (
            "#",
            "Header 1",
        ),
        (
            "##",
            "Header 2",
        ), 
        (
            "###",
            "Header 3",
        ),
        (
            "####",
            "Header 4",
        ), 
        (
            "#####",
            "Header 5",
        ), 
        (
            "######",
            "Header 6",
        ),
    ]

class CREATE_MODEL:
    MODEL = "gpt-4o"
    EMBEDDINGS = OpenAIEmbeddings()
    TEMPERATURE = 0
    PARSER = JsonOutputParser()
    CHUNK_SIZE =1000
    CHUNK_OVERLAP = 50

    PROMPT = PromptTemplate.from_template("""
            # 주제 목차 
            - {topic}
            # 키워드 
            - {kward}
            ## 추가 정보
            - 난이도: 보통
            - 문제 방향: 정의
            - 문제 대상: 대학교 학부생

            # 섹션 retirever
            - {section_retriever}
            # 믄서전체 retirever
            - {document_retriever}

            # 문제
            당신은 객관식 문제를 만드는 도우미입니다.
            다음에 제공된 맥락을 사용하여 객관식 문제를 생성하세요.
            문제는 한국어로 작성되어야 합니다.
            네 개의 선택지를 제공하고, 정답을 표시하세요.
            정답을 모를 경우, "정답을 알 수 없습니다"라고 표시하세요.

            응답은 다음 JSON 형식이어야 합니다:

            {{
                "question": "<여기에 문제를 입력하세요>",
                "options": [
                    "1. <선택지 1>",
                    "2. <선택지 2>",
                    "3. <선택지 3>",
                    "4. <선택지 4>"
                ],
                "explanation": {{
                    "1": "<선택지 1에 대한 설명>",
                    "2": "<선택지 2에 대한 설명>",
                    "3": "<선택지 3에 대한 설명>",
                    "4": "<선택지 4에 대한 설명>"
                }},
                "correct_answer": "<정답 선택지 번호>"
            }}
        """)

