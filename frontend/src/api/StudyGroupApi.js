import axios from 'axios';
import axiosInstance from "./tokenApi";
import { BASE_URL } from './config';
const API_BASE_URL = `${BASE_URL}/api/studygroup`;

// 사용자 퇴출 API 호출 함수
export const removeGroupMember = async (groupId, userId, token) => {
    try {
        const response = await axiosInstance.delete(`${BASE_URL}/api/studygroup/${groupId}/remove-member/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('사용자 퇴출 중 오류 발생:', error);
        throw error;
    }
};

// 관리자 이양 요청 API
// export const transferManager = async (groupId, targetUserId, token) => {
//     try {
//         const userString = localStorage.getItem('user');
//         const user = JSON.parse(userString);
//         const token = user.token;
//
//         if (!token) {
//             throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
//         }
//
//         // axiosInstance.post의 두 번째 인자는 POST 요청의 body, 세 번째 인자는 config 객체입니다.
//         const response = await axiosInstance.post(
//             `${BASE_URL}/api/studygroup/manager-replace/${groupId}`,
//             {}, // 빈 객체 또는 필요한 데이터를 전달 (targetUserId를 body로 전달하지 않으면 빈 객체로 유지)
//             {
//                 params: { targetUserId }, // targetUserId를 URL의 query parameter로 전달
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error("관리자 이양 요청 중 오류 발생:", error);
//         throw error;
//     }
// };

// 스터디 그룹 삭제 API 함수
export const deleteStudyGroup = async (groupId) => {
    try {

        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const token = user.token;

        if (!token) {
            throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
        }

        // 그룹 삭제 API 호출
        const response = await axiosInstance.put(
            `${BASE_URL}/api/studygroup/delete/${groupId}`,
            {}, // PUT 요청에 빈 객체 전달 (필요에 따라 수정)
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data; // 성공 시 데이터 반환
    } catch (error) {
        // 오류 발생 시 예외 처리
        console.error('그룹 삭제 중 오류 발생:', error);
        throw error;
    }
};

// 그룹 멤버 목록 조회 API 호출 함수
export const getGroupMembers = async (groupId) => {
    try {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const token = user.token;

        if (!token) {
            throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
        }

        const response = await axiosInstance.get(`${API_BASE_URL}/${groupId}/members`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('그룹 멤버를 가져오는 중 오류 발생:', error);
        throw error;
    }
};

// 스터디 그룹 생성 API 호출
export const createStudyGroup = async (groupData) => {
    try {
// 로컬 스토리지에서 user 정보 가져오기
        const userString = localStorage.getItem('user');

// 문자열을 JSON 객체로 변환
        const user = JSON.parse(userString);

// token 값 접근
        const token = user.token;

        if (!token) {
            throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
        }

        // 요청 시 헤더에 토큰을 추가
        const response = await axiosInstance.post(`${API_BASE_URL}`, groupData, {
            headers: {
                Authorization: `Bearer ${token}` // 토큰을 헤더에 추가
            }
        });

        return response.data;
    } catch (error) {
        console.error('스터디 그룹 생성 중 오류 발생:', error);
        throw error;
    }
};

// 사용자의 스터디 그룹을 가져오는 API 호출 함수
// export const getUserGroups = async (userId) => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/user`, {
//             params: { userId }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('사용자의 스터디 그룹을 가져오는 중 오류 발생:', error);
//         throw error;
//     }
// };

// 사용자의 스터디 그룹을 가져오는 API 호출 함수
export const getUserGroups = async () => {
    try {
        // 로컬 스토리지에서 user 정보 가져오기
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);

        // 토큰 값 접근
        const token = user.token;

        if (!token) {
            throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
        }

        // 요청 시 헤더에 토큰을 추가하고, userId를 query parameter로 추가
        const response = await axiosInstance.get(`${API_BASE_URL}/user`, {
            params: {
                user_id: user.id // userId를 query parameter로 추가
            },
            headers: {
                Authorization: `Bearer ${token}` // 토큰을 헤더에 추가
            }
        });

        return response.data; // API에서 { groups: [...], total: number } 형식으로 반환된다고 가정
    } catch (error) {
        console.error('사용자의 스터디 그룹을 가져오는 중 오류 발생:', error);
        throw error;
    }
};


// 모든 그룹을 가져오는 API
export const getAllGroups = async () => {
    try {

        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);

        const token = user.token;
        if (!token) {
            throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
        }

        const response = await axiosInstance.get(`${API_BASE_URL}/all`, {
            headers: {
                Authorization: `Bearer ${token}`, // 올바른 Authorization 헤더 추가
            }
        });

        return response.data
    } catch (error) {
        console.error('전체 그룹을 가져오는 중 오류 발생:', error);
        throw error;
    }
};

// 스터디그룹 가입 요청 API 함수
export const joinStudyGroup = async (groupId, message) => {
    try {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const token = user.token;

        if (!token) {
            throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
        }

        const response = await axiosInstance.post(`${API_BASE_URL}/join-request/${groupId}`,
            {
                message_for_join: message
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        return response.data;
    } catch (error) {
        console.error('가입 요청 중 오류 발생:', error);
        throw error;
    }
};

// 전체 가입 요청 조회 API
export const getAllJoinRequests = async (groupId) => {
    try {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const token = user.token;

        if (!token) {
            throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
        }

        const response = await axiosInstance.get(`${API_BASE_URL}/request-list/${groupId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        return response.data;
    } catch (error) {
        console.error('전체 가입 요청 조회 중 오류 발생:', error);
        throw error;
    }
};

// 가입 요청 승인 API 호출 함수
export const acceptJoinRequest = async (joinRequestDTO) => {
    try {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const token = user.token;

        if (!token) {
            throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
        }

        const response = await axiosInstance.put(`${API_BASE_URL}/join-request`, joinRequestDTO, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('가입 요청 승인 중 오류 발생:', error);
        throw error;
    }
};

// 가입 요청 거절 API 호출 함수
export const rejectJoinRequest = async (joinRequestDTO) => {
    try {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const token = user.token;

        if (!token) {
            throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
        }

        const response = await axiosInstance.put(`${API_BASE_URL}/join-request`, joinRequestDTO, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('가입 요청 거절 중 오류 발생:', error);
        throw error;
    }
};