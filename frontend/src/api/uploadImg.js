// {
//     const formData = new FormData();
//     formData.append('image', file);

//     try {
//       const response = await axios.post('http://shinhanstone.click/upload/uploadAjax', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const imageUrl = response.data;
//       console.log(imageUrl)
//       return imageUrl;
//     } catch (error) {
//       console.error(error);
//       Swal.fire('실패!', '이미지 업로드에 실패했습니다.', 'error');
//       throw error;
//     }



import axios from 'axios';

import { BASE_URL } from './config';
export const uploadImg = async (file) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${BASE_URL}/upload/uploadAjax`,formData,{
      headers: {
        Authorization: `Bearer ${token}`, // Authorization 헤더 추가
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response;
  } catch (error) {
    console.error('비활성화 요청 실패:', error);
  }
};
