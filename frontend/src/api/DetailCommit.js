import axios from 'axios';

import { BASE_URL } from './config';
export const postDetailCommit = async (id,content) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const response = await axios.post(`${BASE_URL}/api/reply/create`,{
        post_id: id , content : content
    }, {
      headers: {
        Authorization: `Bearer ${token}`, // Authorization 헤더 추가
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('비활성화 요청 실패:', error);
  }
};

export const getDetailCommitList = async (id,page) => {
    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);
      const token = user.token;
  
      const response = await axios.post(`${BASE_URL}/api/reply`,{
          post_id: id , page : page
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더 추가
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error('비활성화 요청 실패:', error);
    }
  };

  export const postDetailUpdateCommit = async (id,content) => {
    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);
      const token = user.token;
  
      const response = await axios.post(`${BASE_URL}/api/reply/update/${id}`,{
        reply_id: id , content : content
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더 추가
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error('비활성화 요청 실패:', error);
    }
  };


  export const deleteCommentFromServer = async (id) => {
    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);
      const token = user.token;
  
      const response = await axios.post(`${BASE_URL}/api/reply/delete/${id}`,null , {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더 추가
        },
      });
      return response;
    } catch (error) {
      console.error('비활성화 요청 실패:', error);
    }
  };

  export const reportCommentToServer = async (id,report_type,comment) => {
    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);
      const token = user.token;
  
      const response = await axios.post(`${BASE_URL}/api/reports/replies`,{
        reply_id : id, report_type:report_type,comment:comment
      } , {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더 추가
        },
      });
      return response;
    } catch (error) {
      console.error('비활성화 요청 실패:', error);
    }
  };