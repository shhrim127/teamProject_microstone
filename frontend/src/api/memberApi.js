// 회원가입 api
// 회원가입_민지

import axios from "axios";

// const BASE_URL = 'http://shinhanstone.click/api/user';
import { BASE_URL } from './config';
const BASE_URL_ = `${BASE_URL}/api/user`;

// 비동기통신
export const signup = async (userData) => {
    try {
        const response = await fetch(`${BASE_URL_}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if(response.ok) {
            return data;
        } else {
            throw new Error(data.reason || '회원가입 실패');
        }
    } catch (error) {
        console.log('회원가입 중 오류 발생:', error);
        throw error;
    }
}

// 아이디 중복 확인
export const checkUserId = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL_}/check-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user_id: userId})
        });

        const data = await response.json();

        if(response.ok) {
            return data.exists;
        } else {
            throw new Error('아이디 중복 확인 실패')
        }
    } catch (error) {
        console.log('아이디 중복 확인 중 오류 발생: ', error)
        throw error
    }
}

// 닉네임 중복 확인
export const checkUserNickname = async (userNickname) => {
    try {
        const response = await fetch(`${BASE_URL_}/check-nickname`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({nickname: userNickname})
        });

        const data = await response.json();

        if(response.ok) {
            return data.exists;
        } else {
            throw new Error('닉네임 중복 확인 실패')
        }
    } catch (error) {
        console.log('닉네임 중복 확인 중 오류 발생: ', error)
        throw error
    }
}

// 이메일 중복 확인
export const checkUserEmail = async (userEmail) => {
    try {
        const response = await fetch(`${BASE_URL_}/check-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: userEmail})
        });

        const data = await response.json();

        if(response.ok) {
            return data.exists;
        } else {
            throw new Error('이메일 중복 확인 실패')
        }
    } catch (error) {
        console.log('이메일 중복 확인 중 오류 발생: ', error)
        throw error
    }
}

// 소셜 로그인 리디렉션
// 추가 정보 저장 API
export const saveAdditionalInfo = async (userId, additionalInfo) => {
    try {
        const response = await fetch(`${BASE_URL_}/additional-info?user_id=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(additionalInfo)
        });

        if (response.ok) {
            return await response.text(); // 성공 시 응답 메시지를 받음
        } else {
            const errorData = await response.text();
            throw new Error(errorData);
        }
    } catch (error) {
        console.error('추가 정보 저장 중 오류 발생:', error);
        throw error;
    }
};

export const checkAdditionalInfo = async (userId) => {
    try {
        const response = await axios.post(`${BASE_URL_}/check-additional-info`, null, {
            params: { user_id: userId }
        });

        return response.data; // true면 추가 정보가 필요함
    } catch (error) {
        console.error("추가 정보 확인 중 오류 발생:", error);
        throw error;
    }
};