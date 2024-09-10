from math import ceil
import tiktoken
from PIL import Image

def resize(width, height):
    # 2048px을 초과하는 경우 비율에 맞게 축소
    if width > 2048 or height > 2048:
        if height > width:
            scale_factor = 2048 / height
        else:
            scale_factor = 2048 / width
        
        width = int(width * scale_factor)
        height = int(height * scale_factor)
    
    # 짧은 쪽이 768보다 큰 경우에만 768px로 맞추기
    if min(width, height) > 768:
        if height > width:
            scale_factor = 768 / width
        else:
            scale_factor = 768 / height
        
        width = int(width * scale_factor)
        height = int(height * scale_factor)
    return width, height

def count_image_tokens(image_url:str):
    width, height = get_image_dimensions(image_url)
    # 이미지 크기 조정
    width, height = resize(width, height)
    
    # 512px 타일로 나누기
    h_tiles = ceil(height / 512)
    w_tiles = ceil(width / 512)
    
    # 총 타일 수
    total_tiles = h_tiles * w_tiles
    
    # 토큰 계산: 기본 토큰 + 타일 토큰
    total_tokens = 85 + (170 * total_tiles)
    
    return total_tokens

def count_tokens(text: str, model_name: str = "gpt-4o") -> int:
    # 모델 이름에 따라 적절한 인코더를 선택
    enc = tiktoken.encoding_for_model(model_name)
    
    # 텍스트를 토큰화하여 토큰 수 계산
    tokens = enc.encode(text)
    token_count = len(tokens)
    
    return token_count

def get_image_dimensions(image_url: str):
    # 이미지의 가로(width), 세로(height)를 추출하는 로직
    with Image.open(image_url) as img:
        width, height = img.size  # img.size는 (가로, 세로) 튜플을 반환하므로 이를 언패킹
        return width, height

