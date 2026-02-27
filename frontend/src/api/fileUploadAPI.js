// api.js
import Swal from 'sweetalert2';


import { AI_BASE_URL } from './config';
export const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `${AI_BASE_URL}/pdf-data-preprocessing`;
    xhr.open('POST', url, true);

    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    let progressElement;
    let percentElement;

    // SweetAlert2 모달 창 생성
    Swal.fire({
      title: '파일 업로드 중',
      html: `
        <div class="progress">
          <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: 10%;" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <br/>
        업로드 중... <span>0</span>%
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        // 모달 창이 완전히 열린 후 호출
        const swalContent = Swal.getHtmlContainer(); // 변경된 부분
        progressElement = swalContent.querySelector('.progress-bar');
        percentElement = swalContent.querySelector('span');

        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }


        // 업로드 진행 상황 추적
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            // SweetAlert2 프로그래스 바 업데이트
            progressElement.style.width = percentComplete + '%';
            percentElement.textContent = Math.round(percentComplete);
          }
        });

        // 요청 상태 변경 이벤트 처리
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            // 업로드 완료 후 모달 창 닫기
            Swal.close();
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
              } catch (error) {
                reject(error);
              }
            } else {
              reject(new Error("파일 업로드 실패 "));
            }
          }
        };

        // 에러 처리
        xhr.onerror = () => {
          Swal.close();
          reject(new Error('네트워크 에러'));
        };

        // 파일 업로드 시작
        const formData = new FormData();
        // 파일명을 콘솔에 출력하여 확인
        formData.append('file', file, file.name);
        xhr.send(formData);
      },
    });
  });
};
