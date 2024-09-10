import fitz  # PyMuPDF
import os
import base64

def pdf_to_images(pdf_path, output_folder, zoom_factor=4.0):
    img_path_list = []
    # PDF 파일 열기
    document = fitz.open(pdf_path)
    
    # 출력 폴더가 없으면 생성
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # 해상도를 높이기 위한 Matrix 설정
    matrix = fitz.Matrix(zoom_factor, zoom_factor)  # X와 Y 방향으로 zoom_factor 배 확대

    # 각 페이지를 이미지로 변환
    for page_number in range(len(document)):
        page = document.load_page(page_number)  # 페이지 로드
        pix = page.get_pixmap(matrix=matrix)  # 페이지를 픽스맵으로 변환
        img_path = os.path.join(output_folder, f"page_{page_number + 1}.png")  # 이미지 파일 경로 설정
        img_path = img_path.replace("\\","/")
        img_path_list.append(img_path)
        pix.save(img_path)  # 이미지를 파일로 저장
        #print(f"페이지 {page_number + 1}를 이미지로 저장: {img_path}")

    document.close()
    return img_path_list

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def image_to_base64code(image_path_list):
    base64_image = []
    for path in image_path_list:
        img_data = encode_image(path)
        base64_image.append(img_data)
    return base64_image


if __name__ =="__main__":
    # PDF 파일 경로와 출력 폴더 경로 설정
    pdf_path = "C:/Users/tgv99/OneDrive - 신한대학교/책스캔한 파일들/PDF/컴퓨터/데이터베이스 배움터.pdf"
    output_folder = "C:Users/tgv99/OneDrive - 신한대학교/책스캔한 파일들/원본/컴퓨터/test"

    # PDF를 이미지로 변환, 변환한 이미지가 어디에 저장되어 있는지 출력.
    path = pdf_to_images(pdf_path, output_folder)
    print(path)