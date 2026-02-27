import axios from 'axios';

import { AI_BASE_URL } from './config';
import { BASE_URL } from './config';
export const getTaskStatus = async (taskid) => {
  try {

    const response = await axios.get(`${AI_BASE_URL}/status/${taskid}`);
    return response.data;
  } catch (error) {
    console.error('비활성화 요청 실패:', error);
  }
};
