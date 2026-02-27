// 신고 상태 변경 API
import axiosInstance from "./tokenApi";
import {BASE_URL} from "./config";

export const updateReportStatus = async (reportId, newStatus, adminId) => {
    try {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const token = user.token;

        const response = await axiosInstance.put(
            `${BASE_URL}/api/reports/status/${reportId}`,
            null, // PUT 요청의 경우 데이터가 없으므로 null
            {
                params: {
                    newStatus: newStatus,
                    admin_id: adminId, // 관리자 ID
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data; // 성공 시 반환 데이터
    } catch (error) {
        console.error('신고 상태 변경 중 오류 발생:', error);
        throw error; // 에러 발생 시 예외 던지기
    }
};

// 신고 목록 페이징 처리 API
export const fetchReportList = async (page, type, status) => {
    try {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const token = user.token;

        const response = await axiosInstance.post(`${BASE_URL}/api/reports/paging`, {
            page: page,
            type: type, // 'post' 또는 'reply' 타입 지정
            status: status
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        debugger
        return response.data.content; // 성공 시 반환 데이터
    } catch (error) {
        console.error('신고 목록 로드 중 오류 발생:', error);
        throw error; // 에러 발생 시 예외 던지기
    }
};