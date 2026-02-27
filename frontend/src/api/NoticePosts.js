import axios from 'axios';

import { BASE_URL } from './config';
export const getNoticePosts = async (page) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const response = await axios.get(`${BASE_URL}/posts/paging/public/${page}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Authorization 헤더 추가
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('비활성화 요청 실패:', error);
  }
};
