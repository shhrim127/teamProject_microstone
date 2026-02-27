import axios from 'axios';

// 파일 업로드를 처리하는 함수
export const uploadFile = async (formData) => {
  try {
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // 서버에서 받은 데이터를 반환
  } catch (error) {
    throw new Error('파일 업로드에 실패했습니다.');
  }
};
