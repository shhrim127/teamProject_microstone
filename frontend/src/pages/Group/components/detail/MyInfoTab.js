import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from "../../../../api/tokenApi";  // API 호출을 위한 axios 인스턴스
import { BASE_URL } from '../../../../api/config';  // API 기본 URL
import { useNavigate } from 'react-router-dom'; // Replace useHistory with useNavigate

const MyInfoTab = ({ groupId }) => {
  const [joinDate, setJoinDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Use navigate instead of history

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const token = user.token;
        if (!token) throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');

        const response = await axiosInstance.get(`${BASE_URL}/api/studygroup/${groupId}/myinfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { join_date } = response.data;

        setJoinDate(join_date);
      } catch (error) {
        console.error('내 정보를 불러오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [groupId]);

  const handleLeaveGroup = async () => {
    const result = await Swal.fire({
      title: '그룹 탈퇴 확인',
      text: '정말로 그룹을 탈퇴하시겠습니까?',
      input: 'text',
      inputPlaceholder: '탈퇴하려면 "탈퇴"를 입력해주세요.',
      showCancelButton: true,
      confirmButtonText: '탈퇴',
      cancelButtonText: '취소',
    });

    if (result.isConfirmed && result.value === '탈퇴') {
      try {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const token = user.token;

        await axiosInstance.put(
          `${BASE_URL}/api/studygroup/leave`,
          { group_id: groupId, user_id: user.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire('탈퇴 완료', '성공적으로 그룹을 탈퇴하였습니다.', 'success').then((result) => {
          if (result.isConfirmed) {
            navigate('/group/my-group'); // Use navigate instead of history.push
          }
        });
      } catch (error) {
        Swal.fire('탈퇴 실패', '탈퇴하는 중 문제가 발생했습니다.', 'error');
      }
    } else if (result.isConfirmed) {
      Swal.fire('탈퇴 실패', '"탈퇴"를 정확히 입력해주세요.', 'error');
    }
  };

  return (
    <div className="my-info-tab">
      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <>
          <div style={{ marginTop: '20px' }}>
            <button className="btn btn-danger" onClick={handleLeaveGroup}>
              그룹 탈퇴
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyInfoTab;
