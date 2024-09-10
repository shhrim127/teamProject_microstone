from langchain_community.document_loaders.base import BaseLoader
from langchain_core.documents import Document
from langchain.text_splitter import MarkdownHeaderTextSplitter
import os
from typing import  Iterator
from config import LOADER
from dotenv import load_dotenv
load_dotenv()

IMAGE_FOLDER = os.getenv("IMAGE_FOLDER")

class MarkdownLoader(BaseLoader):
    def __init__(self, uuid: str):
        self.file_path = f"{IMAGE_FOLDER}{uuid}.md"

    def lazy_load(self) -> Iterator[Document]:
        """Markdown 파일을 읽고 Document 객체로 변환하여 반환하는 제너레이터"""
        # 마크다운 파일을 읽어서 텍스트로 변환
        with open(self.file_path, 'r', encoding='utf-8') as file:
            markdown_text = file.read()
        
        markdown_splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=LOADER.HEADERS_TO_SPLIT_ON,
            strip_headers=False
        )
        md_header_splits = markdown_splitter.split_text(markdown_text)
        
        # Document 객체로 반환
        yield from md_header_splits

