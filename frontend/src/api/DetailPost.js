import axios from 'axios';

import { BASE_URL } from './config';
export const getPostBody = async (id) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const response = await axios.get(`${BASE_URL}/api/posts/${id}`, {
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
export const getPostCommit = async (id,page) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const response = await axios.post(`${BASE_URL}/api/reply`, {
      post_id : id, page: page
    },{
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

export const updateDetailStatus = async (id,status) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const response = await axios.post(`${BASE_URL}/api/posts/recommend`, {
      post_id : id, recommendation: status
    },{
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

export const postReport = async (id,report_type,comment) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const response = await axios.post(`${BASE_URL}/api/reports/posts`, {
      post_id : id, report_type: report_type,comment:comment
    },{
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


export const deletePost = async (id) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const response = await axios.post(`${BASE_URL}/api/posts/delete`, {
      post_id : id
    },{
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