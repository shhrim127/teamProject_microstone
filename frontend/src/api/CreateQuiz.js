import axios from 'axios';
import { BASE_URL } from './config';

export const createQuiz = async (pdf_id, count) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    // 반복해서 요청을 보내는 로직
    const requests = [];
    for (let i = 0; i < count; i++) {
      const request = axios.get(
        `${BASE_URL}/api/question/makeQuestion/${pdf_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization 헤더 추가
          },
        }
      );
      requests.push(request); // 요청을 배열에 저장
    }

    // 모든 요청이 완료될 때까지 기다림
    const responses = await Promise.all(requests);

    // 모든 응답을 반환
    return responses;
  } catch (error) {
    console.error('요청 실패:', error);
  }
};
