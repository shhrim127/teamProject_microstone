import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { getAllJoinRequests, acceptJoinRequest, rejectJoinRequest } from '../../../../../api/StudyGroupApi';

const RequestManagement = ({ groupId }) => {
  const [joinRequests, setJoinRequests] = useState([]);

  // const fetchJoinRequests = async () => {
  //   try {
  //     const response = await getAllJoinRequests(groupId);
  //     console.log(response); // 응답 데이터 확인
  //     // joinRequests 배열을 올바르게 추출하여 상태 업데이트
  //     if (response && response.joinRequests) {
  //       setJoinRequests(response.joinRequests);
  //     } else {
  //       console.error('Unexpected data format:', response);
  //       setJoinRequests([]); // 비정상 데이터일 경우 빈 배열 설정
  //     }
  //   } catch (error) {
  //     console.error('가입 요청을 가져오는 중 오류 발생:', error);
  //     setJoinRequests([]); // 오류 발생 시 빈 배열 설정
  //   }
  // };

  const fetchJoinRequests = async () => {
    try {
      const response = await getAllJoinRequests(groupId);
      console.log(response); // 응답 데이터 확인
      // joinRequests 배열을 올바르게 추출하여 상태 업데이트
      if (response && response.joinRequests) {
        // 상태가 'PENDING'인 요청들만 필터링
        const pendingRequests = response.joinRequests.filter(
            (request) => request.status === 'PENDING'
        );
        setJoinRequests(pendingRequests);
      } else {
        console.error('Unexpected data format:', response);
        setJoinRequests([]); // 비정상 데이터일 경우 빈 배열 설정
      }
    } catch (error) {
      console.error('가입 요청을 가져오는 중 오류 발생:', error);
      setJoinRequests([]); // 오류 발생 시 빈 배열 설정
    }
  };


  // // 가입 요청 승인 함수
  // const handleAcceptRequest = async (requestId) => {
  //   try {
  //
  //     const joinRequestDTO = {
  //       id: requestId,
  //       group_id: groupId,
  //       status: 'APPROVED'
  //     }; // JoinRequestDTO 객체 생성
  //     console.log(joinRequestDTO)
  //     await acceptJoinRequest(joinRequestDTO);
  //     message.success('가입 요청이 승인되었습니다.');
  //     await fetchJoinRequests(); // 업데이트 후 전체 요청 다시 로드
  //   } catch (error) {
  //     message.error('가입 요청 승인 중 오류가 발생했습니다.');
  //   }
  // };

  // 가입 요청 승인 함수
  const handleAcceptRequest = async (requestId) => {
    try {
      // `joinRequests`에서 해당 요청의 user_id와 message_for_join 정보를 찾음
      const joinRequest = joinRequests.find(request => request.id === requestId);

      const joinRequestDTO = {
        id: requestId,
        group_id: groupId,
        user_id: joinRequest.user_id,  // 사용자 ID 추가
        message_for_join: joinRequest.message_for_join,  // 가입 메시지 추가
        status: 'APPROVED'
      }; // JoinRequestDTO 객체 생성

      console.log('Sending DTO:', joinRequestDTO); // DTO 확인
      await acceptJoinRequest(joinRequestDTO);
      message.success('가입 요청이 승인되었습니다.');
      await fetchJoinRequests(); // 업데이트 후 전체 요청 다시 로드
    } catch (error) {
      message.error('가입 요청 승인 중 오류가 발생했습니다.');
    }
  };


  // 가입 요청 거절 함수
  const handleRejectRequest = async (requestId) => {
    try {
      // `joinRequests`에서 해당 요청의 user_id와 message_for_join 정보를 찾음
      const joinRequest = joinRequests.find(request => request.id === requestId);

      const joinRequestDTO = {
        id: requestId,
        group_id: groupId,
        user_id: joinRequest.user_id,  // 사용자 ID 추가
        message_for_join: joinRequest.message_for_join,  // 가입 메시지 추가
        status: 'REJECTED'
      }; // JoinRequestDTO 객체 생성

      await rejectJoinRequest(joinRequestDTO);
      message.success('가입 요청이 거절되었습니다.');
      await fetchJoinRequests(); // 업데이트 후 전체 요청 다시 로드
    } catch (error) {
      message.error('가입 요청 거절 중 오류가 발생했습니다.');
    }
  };

  // 컴포넌트 마운트 시 전체 요청을 로드
  useEffect(() => {
    fetchJoinRequests();
  }, [groupId]);

  const requestColumns = [
    {
      title: '아이디',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: '메시지',
      dataIndex: 'message_for_join',
      key: 'message_for_join',
    },
    {
      title: '요청 상태',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '승인',
      key: 'COMPLETED',
      render: (text, record) => (
          <Button type="primary" onClick={() => handleAcceptRequest(record.id)}>승인</Button>
      ),
    },
    {
      title: '거절',
      key: 'reject',
      render: (text, record) => (
          <Button danger onClick={() => handleRejectRequest(record.id)}>거절</Button>
      ),
    },
  ];

  return <Table dataSource={joinRequests} columns={requestColumns} rowKey="id" />;
};

export default RequestManagement;