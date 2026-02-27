import { BASE_URL } from './config';

// 비밀번호 재설정 이메일 전송 API 호출
export const sendResetPasswordEmail = async (email) => {
    try {
        const response = await fetch(`${BASE_URL}/api/password-reset/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ email }),  // 이메일 데이터를 URL 인코딩 방식으로 전송
        });

        if (!response.ok) {
            throw new Error('비밀번호 재설정 이메일 전송에 실패했습니다.');
        }

        // 응답이 텍스트인 경우 text()로 받아 처리
        return await response.text();  // JSON이 아닌 텍스트 응답으로 처리
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// src/api/findPasswordApi.js
export const resetPassword = async (token, newPassword) => {
    try {
        const response = await fetch(`${BASE_URL}/api/password-reset/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                password_token: token,  // 서버에서 요구하는 정확한 파라미터 이름 확인
                newPassword: newPassword
            }),
        });

        if (!response.ok) {
            throw new Error('비밀번호 재설정에 실패했습니다.');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};