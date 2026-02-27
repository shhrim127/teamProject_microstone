import { BASE_URL } from './config';
export const getUserInfo = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/user/info/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('유저 정보를 가져오는데 실패했습니다.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
