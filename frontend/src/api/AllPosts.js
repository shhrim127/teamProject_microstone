import axios from 'axios';

import { BASE_URL } from './config';
export const getAllPosts = async (page,board,type="public",group_id=0) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const response = await axios.post(`${BASE_URL}/posts/paging`,{
      page:page,
      type:type,
      category: board,
      group_id : group_id
    }, {
      headers: {
        Authorization: `Bearer ${token}`, // Authorization 헤더 추가
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('비활성화 요청 실패:', error);
  }
};
