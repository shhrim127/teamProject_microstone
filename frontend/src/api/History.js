import axios from 'axios';
import { BASE_URL } from "./config";


export const getHistoryList = async (page_, pdf_id_) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const response = await axios.post(`${BASE_URL}/api/question/reminderQuestionList`, {
        page: page_, pdf_id: pdf_id_
    }, {
      headers: {
        Authorization: `Bearer ${token}`,  // Authorization 헤더 추가
        'Content-Type': 'application/json',  // JSON 형식으로 전송
      },
    });
    console.log(response.data);
    return response.data;  // response 객체에서 data를 반환
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
    throw error;  // 에러 발생 시 에러를 던져서 호출 측에서 처리
  }
};

//오답노트 문제 삭제
export const removeToWrongAnswerNote = async (id) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const response = await axios.post(`${BASE_URL}/api/question/removeReminder`, {
      question_id: id
    }, {
      headers: {
        Authorization: `Bearer ${token}`,  // Authorization 헤더 추가
        'Content-Type': 'application/x-www-form-urlencoded',  // JSON 형식으로 전송
      },
    });
    console.log(response.data);
    return response;  // response 객체에서 data를 반환
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
    throw error;  // 에러 발생 시 에러를 던져서 호출 측에서 처리
  }
};

export const getHistoryTalbe = async (page_) => {
  try {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const token = user.token;

    const response = await axios.post(`${BASE_URL}/api/question/reminderList`, {
      page: page_
    }, {
      headers: {
        Authorization: `Bearer ${token}`,  // Authorization 헤더 추가
        'Content-Type': 'application/x-www-form-urlencoded',  // JSON 형식으로 전송
      },
    });
    return response.data;  // response 객체에서 data를 반환
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
    throw error;  // 에러 발생 시 에러를 던져서 호출 측에서 처리
  }
};