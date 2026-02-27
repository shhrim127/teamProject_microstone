import axios from 'axios';

import { BASE_URL } from './config';
export const deactivateUser = async () => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const response = await axios.post(`${BASE_URL}/api/member/deactivate`, {
      user_id: user.id,  // POST 요청의 본문으로 전송
    }, {
      headers: {
        Authorization: `Bearer ${token}`, // Authorization 헤더 추가
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    return response;
  } catch (error) {
    console.error('비활성화 요청 실패:', error);
  }
};
