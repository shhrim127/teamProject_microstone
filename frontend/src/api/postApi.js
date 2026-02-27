// PostApi.js
import { BASE_URL } from './config';
import axios from 'axios';

// 게시글 생성 API
export const createPost = async (title, editorHtml, category, type,group_id=0) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    if (!token) {
      throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
    }

    // 기본 POST 요청의 body 데이터
    const postData = {
      board_id: 1, // Fixed board ID
      title: title,
      content: editorHtml,
      category: category,
      group_type:type
    };

    // is_studyGroup이 true일 경우, group_id와 group_type 추가
    if (type==="study_group") {
      postData.group_id = group_id;
    }

    // POST 요청 전송
    const response = await axios.post(`${BASE_URL}/api/posts`, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response;
  } catch (error) {
    console.error('게시글 등록 중 오류 발생:', error);
    throw error;
  }
};


export const updatePost = async (id,title,editorHtml) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const response = await axios.post(`${BASE_URL}/api/posts/update`, {
      post_id: id ,title:title,content:editorHtml
    },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

    return response;
  } catch (error) {
    console.error('게시글 등록 중 오류 발생:', error);
    throw error;
  }
};

// // 게시글 수정 API
// export const updatePost = async (postId, postData) => {
//   try {
//     const response = await axiosInstance.put(`/api/postApi/${postId}`, postData);
//     return response.data;
//   } catch (error) {
//     console.error('게시글 수정 중 오류 발생:', error);
//     throw error;
//   }
// };

// // 게시글 삭제 API
// export const deletePost = async (postId) => {
//   try {
//     const response = await axiosInstance.delete(`/api/postApi/${postId}`);
//     return response.data;
//   } catch (error) {
//     console.error('게시글 삭제 중 오류 발생:', error);
//     throw error;
//   }
// };

// // 게시글 목록 조회 API
// export const getpostApi = async () => {
//   try {
//     const response = await axiosInstance.get('/api/postApi');
//     return response.data;
//   } catch (error) {
//     console.error('게시글 목록 조회 중 오류 발생:', error);
//     throw error;
//   }
// };

// // 게시글 상세 조회 API
// export const getPostById = async (postId) => {
//   try {
//     const response = await axiosInstance.get(`/api/postApi/${postId}`);
//     return response.data;
//   } catch (error) {
//     console.error('게시글 조회 중 오류 발생:', error);
//     throw error;
//   }
// };
