import React, {useEffect, useState} from 'react';
import {Select, Button, message} from 'antd';
import MemberManagement from './management/MemberManagement';
import RequestManagement from './management/RequestManagement';
import LogManagement from './management/LogManagement';
import Swal from 'sweetalert2';
import {BASE_URL} from "../../../../api/config";
import axiosInstance from "../../../../api/tokenApi";
import {deleteStudyGroup, getGroupMembers} from "../../../../api/StudyGroupApi";
import {useNavigate} from "react-router-dom";

const { Option } = Select;

const ManagementTab = ({groupId}) => {
  console.log('group id : ', groupId)
  const [activeTab, setActiveTab] = useState('members');
  // const [groupMembers, setGroupMembers] = useState([
  //   { id: 1, name: 'Leader', role: 'leader' },
  //   { id: 2, name: 'Member1', role: 'member' },
  //   { id: 3, name: 'Member2', role: 'member' },
  // ]); // 그룹 멤버 예시 (Mock 데이터)

  const [groupMembers, setGroupMembers] = useState([]); // 초기 멤버 리스트 상태

  // 그룹 멤버를 가져오는 함수
  const fetchGroupMembers = async () => {
    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);
      const token = user.token;

      if (!token) {
        throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
      }

      const members = await getGroupMembers(groupId, token);
      setGroupMembers(members);
    } catch (error) {
      message.error('멤버 목록을 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 콤보박스 선택 시 탭 변경 함수
  const handleComboboxChange = (value) => {
    setActiveTab(value);
  };

  // 컴포넌트가 처음 마운트되거나, 그룹 ID가 변경될 때 멤버 데이터를 가져옴
  useEffect(() => {
    if (activeTab === 'members') {
      fetchGroupMembers();
    }
  }, [groupId, activeTab]);

  // 사용자 퇴출 함수
  const removeUser = async (id) => {
    const isConfirmed = await Swal.fire({
      title: '퇴출 확인',
      text: '이 사용자를 정말 퇴출하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    });

    if (isConfirmed.isConfirmed) {
      // 멤버를 삭제하는 로직
      setGroupMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));

      // 상태 업데이트 후 UI 반영 확인
      Swal.fire('유저가 성공적으로 퇴출되었습니다.', '', 'success');
    }
  };

  // 그룹 삭제 함수
  // const deleteGroup = async () => {
  //   const remainingMembers = groupMembers.filter((member) => member.role !== 'leader');
  //
  //   if (remainingMembers.length > 0) {
  //     Swal.fire({
  //       title: '그룹 삭제 불가',
  //       text: '그룹장을 제외한 멤버들이 남아있어 그룹을 삭제할 수 없습니다.',
  //       icon: 'error',
  //       confirmButtonText: '확인',
  //     });
  //     return;
  //   }
  //
  //   const result = await Swal.fire({
  //     title: '그룹 삭제 확인',
  //     text: '그룹을 삭제하시려면 "삭제"를 입력해주세요.',
  //     input: 'text',
  //     inputPlaceholder: '삭제',
  //     showCancelButton: true,
  //     confirmButtonText: '삭제',
  //     cancelButtonText: '취소',
  //   });
  //
  //   if (result.isConfirmed && result.value === '삭제') {
  //     try {
  //       // 스터디 그룹 삭제 API 호출
  //       await axiosInstance.put(`${BASE_URL}/api/studygroup/delete/${groupId}`);
  //
  //       // 성공 메시지 표시
  //       Swal.fire('삭제 완료', '그룹이 성공적으로 삭제되었습니다.', 'success');
  //
  //       // 그룹 삭제 후 추가 작업 (예: 페이지 이동 등)
  //     } catch (error) {
  //       // 오류 메시지 표시
  //       Swal.fire('삭제 실패', '그룹 삭제 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
  //     }
  //   } else if (result.isConfirmed) {
  //     Swal.fire('삭제 실패', '"삭제"를 정확히 입력해주세요.', 'error');
  //   }
  // };

  const navigate = useNavigate();

  // 그룹 삭제 함수
  const deleteGroup = async () => {
    const result = await Swal.fire({
      title: '그룹 삭제 확인',
      text: '그룹을 삭제하시려면 "삭제"를 입력해주세요.',
      input: 'text',
      inputPlaceholder: '삭제',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    });

    if (result.isConfirmed && result.value === '삭제') {
      try {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const token = user.token;

        if (!token) {
          throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
        }

        // 스터디 그룹 삭제 API 호출
        await deleteStudyGroup(groupId, token);

        // 성공 메시지 표시
        Swal.fire('삭제 완료', '그룹이 성공적으로 삭제되었습니다.', 'success')
            .then(() => {
              navigate("/group/my-group")
            })

        // 그룹 삭제 후 추가 작업 (예: 페이지 이동 등)
      } catch (error) {
        // 오류 메시지 표시
        Swal.fire('삭제 실패', '그룹 삭제 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
      }
    } else if (result.isConfirmed) {
      Swal.fire('삭제 실패', '"삭제"를 정확히 입력해주세요.', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Select defaultValue="members" style={{ width: 180 }} onChange={handleComboboxChange}>
          <Option value="members">멤버 관리</Option>
          <Option value="register">가입 신청 관리</Option>
          {/* <Option value="logs">로그</Option> */}
        </Select>
        <Button type="primary" danger onClick={deleteGroup}>
          그룹 삭제
        </Button>
      </div>

      {/* 각 탭에 따른 컴포넌트 렌더링 */}
      {activeTab === 'members' && (
        <MemberManagement
            groupId={groupId}
          groupMembers={groupMembers}  // 멤버 상태 전달
          removeUser={removeUser}      // removeUser 함수 전달
        />
      )}
      {activeTab === 'register' && (
        <RequestManagement
          // 가입 신청 관련 함수 전달
            groupId={groupId}
        />
      )}
      {activeTab === 'logs' && <LogManagement />}
    </div>
  );
};

export default ManagementTab;