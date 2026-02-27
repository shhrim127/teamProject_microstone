import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from "../../../../api/tokenApi";
import {joinStudyGroup} from "../../../../api/StudyGroupApi";
import {BASE_URL} from "../../../../api/config";

const MainTab = ({ groupId }) => {
  const [groupLeader, setGroupLeader] = useState('');
  const [memberCount, setMemberCount] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);
  const userId = user.id

  // 그룹 정보 API 호출
  useEffect(() => {

    const fetchGroupDetails = async () => {
      try {

        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);

        // 토큰 값 접근
        const token = user.token;

        if (!token) {
          throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
        }

        const response = await axiosInstance.get(`${BASE_URL}/api/studygroup/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}` // 토큰을 헤더에 추가
          }
        });
        const groupData = response.data;
        console.log(response.data);


        // 상태 업데이트
        setGroupLeader(groupData.admin_nickname);
        setMemberCount(groupData.present_member_num);
        // setIsMember(groupData.is_member);

        // 그룹 멤버 정보 가져오기
        const membersResponse = await axiosInstance.get(`${BASE_URL}/api/studygroup/${groupId}/members`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const membersData = membersResponse.data;

        // 현재 사용자가 멤버 리스트에 있는지 확인
        // const isUserMember = membersData.some(member => member.userId === userId && member.groupId === groupId);
        // setIsMember(isUserMember);

        // 디버깅을 위한 로그 출력
        console.log("membersData: ", membersData);
        console.log("userId: ", userId);

        // 멤버 리스트와 현재 사용자 아이디 및 그룹 아이디 비교
        const isUserMember = membersData.some(member => {
          console.log("member data: ", member); // 각 멤버의 데이터 확인
          // 대소문자 구분 및 정확한 키 확인
          return member.userId === userId;
        });
        console.log("isUserMember: ", isUserMember);
        setIsMember(isUserMember);
      } catch (error) {
        console.error('그룹 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleMouseDown = () => {
    setIsButtonPressed(true);
  };

  const handleMouseUp = () => {
    setIsButtonPressed(false);
  };

  const handleJoinClick = async () => {
    const { value: message, isConfirmed } = await Swal.fire({
      input: "textarea",
      inputLabel: "가입신청",
      inputPlaceholder: "가입 이유를 적어주세요.",
      showCancelButton: true,
      confirmButtonText: '신청하기',
      cancelButtonText: '취소'
    });

    if (isConfirmed && !message) {
      Swal.fire({
        icon: 'warning',
        title: '메세지 필요',
        text: '가입 신청 메세지를 입력해 주세요!',
      });
    } else if (message) {
      // onJoinClick(groupId, message);  // 부모 컴포넌트에 메시지 전달

      try {
        await joinStudyGroup(groupId, message);

        Swal.fire({
          icon: 'success',
          title: '신청 완료',
          text: '가입 신청이 성공적으로 제출되었습니다!',
        });
      } catch (error) {
        Swal.fire({
          icon: 'warning',
          title: '오류 발생',
          text: '가입 신청 중 문제가 발생했습니다. 다시 시도해주세요',
        })
      }
    }
  };

  return (
      <div className="main-tab">
        <div className="group-info">
          <p><strong>대표 :</strong> {groupLeader}</p>
          <p><strong>멤버 수 :</strong> {memberCount}명</p>
        </div>

        {!isMember && (
            <div className="join-button" style={{ marginTop: '20px' }}>
              <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleJoinClick}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  style={{
                    padding: '5px 20px',
                    backgroundColor: isButtonPressed ? '#0056b3' : '#227bff',
                    color: '#fff',
                    borderRadius: '5px',
                    transform: isButtonPressed ? 'scale(0.95)' : 'scale(1)',
                    transition: 'transform 0.1s ease-in-out',
                  }}
              >
                가입
              </button>
            </div>
        )}
      </div>
  );
};

export default MainTab;