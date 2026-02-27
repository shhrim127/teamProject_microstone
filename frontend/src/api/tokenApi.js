import axios from 'axios';
import { BASE_URL } from './config';
import { useNavigate } from 'react-router-dom';

// axios 인스턴스 생성
const axiosInstance = axios.create();

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
    response => response,  // 성공적인 응답 처리
    error => {
        if (error.response && error.response.status === 401) {
            // 로컬 스토리지에서 저장된 사용자 정보 가져오기
            localStorage.removeItem('user');  // 사용자 정보 삭제
            localStorage.removeItem('user_id');

            // react-router-dom의 useNavigate 훅을 사용하여 로그인 페이지로 이동
            const navigate = useNavigate();
            navigate('/user/login');

            // 에러를 그대로 반환하여 후속 처리 방지
            return Promise.reject(error);
        }

        return Promise.reject(error);  // 다른 오류에 대한 기본 처리
    }
);

export default axiosInstance;