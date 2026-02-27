import axios from 'axios';

import { BASE_URL } from './config';

export const getQuizTable = async (page) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const response = await axios.get(`${BASE_URL}/api/question/pdfList/${page}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Authorization 헤더 추가
        'Content-Type': 'application/json',
      },
    });
    return response.data;  // response 객체에서 data를 반환
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
    throw error;  // 에러 발생 시 에러를 던져서 호출 측에서 처리
  }
};
