import Swal from 'sweetalert2';

import { AI_BASE_URL } from './config';

// 매번 로컬 스토리지에서 작업 리스트를 확인하고 진행 상태를 업데이트하는 함수
export const getState = () => {
  return new Promise((resolve, reject) => {
    // 로컬 스토리지에서 작업 리스트를 불러옴
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (storedTasks.length === 0) {
      return resolve(); // 작업이 없으면 종료
    }

    // SweetAlert2 모달 창 생성
    Swal.fire({
      toast: true,
      icon: 'info',
      position: "top-end",
      title: '파일 전처리 중...',
      html: storedTasks.map(task => `
        <div id="task-container-${task.task_id}" style="margin-bottom: 10px;">
          <strong>${task.file_name}</strong>
          <div class="progress" style="margin-bottom: 5px;">
            <div id="progress-bar-${task.task_id}" class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <span id="progress-text-${task.task_id}">0%</span>
        </div>
      `).join(''),
      showConfirmButton: false,
      willClose: () => {
        resolve(); 
      },
      didOpen: () => {
        storedTasks.forEach(task => {
          

          // 상태 확인하는 함수 정의
          const checkStatus = () => {
            const xhr = new XMLHttpRequest();
            const url = `${AI_BASE_URL}/status/${task.task_id}`;
            xhr.open('GET', url, true);

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const progressElement = document.getElementById(`progress-bar-${task.task_id}`);
                    const percentElement = document.getElementById(`progress-text-${task.task_id}`);

                    let percentComplete = 0;
                    const response = JSON.parse(xhr.responseText);
                    console.log(response)
                    if (response.state === 'PENDING' ) {
                        percentElement.textContent = '전처리 대기중...';
                        progressElement.style.width = percentComplete + '%';
                    }if (response.state === 'STARTED') {
                        percentElement.textContent = '전처리 준비중...';
                        progressElement.style.width = percentComplete + '%';
                    }
                    if (response.state === 'PROGRESS') {
                        percentComplete = response.result.total_status
                        progressElement.style.width = percentComplete + '%';
                        percentElement.textContent = `${Math.round(percentComplete)}% 완료`;
                    }
                    if (response.state === 'SUCCESS') {
                        const updatedTasks = storedTasks.filter(t => t.task_id !== task.task_id);
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                    }
                  
                } catch (error) {
                  console.error('진행률 업데이트 중 오류 발생:', error);

                  // 오류 발생 시 작업을 로컬 스토리지에서 즉시 삭제
                  const updatedTasks = storedTasks.filter(t => t.task_id !== task.task_id);
                  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                  const taskContainer = document.getElementById(`task-container-${task.task_id}`);
                    if (taskContainer) {
                      taskContainer.remove();
                    }

                  reject(new Error('진행률 업데이트 중 오류 발생'));
                }
              } else {
                console.error('요청 실패:', xhr.statusText);

                // 요청 실패 시 작업을 로컬 스토리지에서 즉시 삭제
                const updatedTasks = storedTasks.filter(t => t.task_id !== task.task_id);
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                const taskContainer = document.getElementById(`task-container-${task.task_id}`);
                    if (taskContainer) {
                      taskContainer.remove();
                    }

                reject(new Error('요청 실패'));
              }
            };

            xhr.onerror = () => {
              console.error('네트워크 에러 발생');
              clearInterval(interval);

              // 네트워크 오류 발생 시 작업을 로컬 스토리지에서 즉시 삭제
              const updatedTasks = storedTasks.filter(t => t.task_id !== task.task_id);
              localStorage.setItem('tasks', JSON.stringify(updatedTasks));

              reject(new Error('네트워크 에러'));
            };

            xhr.send(); // 첫 번째 요청 즉시 전송
          };

          // 첫 번째 요청을 즉시 보내기
          checkStatus();

          // 이후 5초마다 상태 확인
          const interval = setInterval(checkStatus, 5000);
        });
      }
    });

    resolve(); // 모든 요청을 확인한 후 즉시 처리 완료
  });
};
