import React from 'react';
import {Table, Button, message} from 'antd';
import {removeGroupMember, transferManager} from "../../../../../api/StudyGroupApi";

const MemberManagement = ({ groupId ,groupMembers, changeUserRole, removeUser }) => {

  const memberColumns = [
    {
      title: '닉네임',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '역할',
      dataIndex: 'role',
      key: 'role',
    },
    // {
    //   title: '관리자 이양',
    //   key: 'changeRole',
    //   render: (text, record) => (
    //       // 역할이 'LEADER'가 아니면 권한 변경 버튼을 표시
    //       record.role !== 'LEADER' ? (
    //           <Button onClick={() => handleTransferManager(record.userId)}>관리자 이양</Button>
    //       ) : null
    //   ),
    // },
    {
      title: '퇴출',
      key: 'remove',
      render: (text, record) => (
          // 역할이 'LEADER'가 아니면 퇴출 버튼을 표시
          record.role !== 'LEADER' ? (
              <Button danger onClick={() => handleRemoveUser(record.userId)}>퇴출</Button>
          ) : null
      ),
    },
  ];

  // 사용자 퇴출 함수
  const handleRemoveUser = async (userId) => {
    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);
      const token = user.token;

      if (!token) {
        throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
      }

      // API 호출하여 사용자 퇴출
      const response = await removeGroupMember(groupId, userId, token);

      if (response.result === 'success') {
        message.success('사용자가 성공적으로 퇴출되었습니다.');
        // 필요 시 그룹 멤버 리스트를 업데이트하는 추가 로직 작성 가능

        window.location.reload();
      } else {
        message.error(response.message || '사용자 퇴출 중 오류가 발생했습니다.');
      }
    } catch (error) {
      message.error('사용자 퇴출 중 오류가 발생했습니다.');
    }
  };

  // 관리자 이양 함수
  // const handleTransferManager = async (targetUserId) => {
  //   try {
  //     const userString = localStorage.getItem('user');
  //     const user = JSON.parse(userString);
  //     const token = user.token;
  //
  //     if (!token) {
  //       throw new Error('토큰이 없습니다. 로그인을 먼저 해주세요.');
  //     }
  //
  //     const response = await transferManager(groupId, targetUserId, token);
  //
  //     if (response.result === 'success') {
  //       message.success('관리자 이양이 성공적으로 요청되었습니다.');
  //       // 필요에 따라 멤버 리스트를 업데이트하거나 다른 추가 작업을 수행할 수 있습니다.
  //     } else {
  //       message.error(response.message || '관리자 이양 요청 중 오류가 발생했습니다.');
  //     }
  //   } catch (error) {
  //     message.error('관리자 이양 요청 중 오류가 발생했습니다.');
  //   }
  // };

  return <Table dataSource={groupMembers} columns={memberColumns} rowKey="id" />;
};

export default MemberManagement;
