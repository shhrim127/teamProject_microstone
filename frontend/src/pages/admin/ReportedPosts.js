import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { fetchReportList, updateReportStatus } from "../../api/adminApi";
import {Link} from "react-router-dom";

const ReportedPosts = () => {
  const [reportedPosts, setReportedPosts] = useState([]);

  // 신고된 게시글 데이터를 로드하는 함수
  const loadReportedPosts = async () => {
    try {
      const data = await fetchReportList(1, 'post'); // 첫 번째 페이지, 'post' 타입
      setReportedPosts(data); // 신고된 게시글 데이터 설정
    } catch (error) {
      console.error('신고된 게시글 로드 중 오류 발생:', error);
      message.error('신고된 게시글을 불러오는 중 문제가 발생했습니다.');
    }
  };

  // useEffect 훅을 사용하여 컴포넌트가 마운트될 때 데이터를 로드
  useEffect(() => {
    loadReportedPosts();
  }, []);  // 빈 배열을 사용하여 컴포넌트 마운트 시에만 한 번 실행

  // 게시글 신고 상태 업데이트 함수
  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString);
      const adminId = user.uid; // 사용자 UID 가져오기

      await updateReportStatus(reportId, newStatus, adminId); // 상태 업데이트 API 호출
      message.success('신고 상태가 업데이트되었습니다.');
      loadReportedPosts(); // 상태 업데이트 후 리스트 갱신
    } catch (error) {
      console.error('신고 상태 업데이트 중 오류 발생:', error);
      message.error('신고 상태 업데이트에 실패했습니다.');
    }
  };

  return (
    <Table
      columns={[
        {
          title: '게시글 ID',
          dataIndex: 'post_id',  // DTO에 맞게 수정
          key: 'post_id',
          width: '15%',
          align: 'center',
        },
        {
          title: '제목',
          dataIndex: 'content',  // 데이터 구조 확인 필요
          key: 'content',
          width: '35%',
        },
        {
          title: '신고 사유',
          dataIndex: 'report_type',  // DTO에 맞게 수정
          key: 'report_type',
          width: '30%',
        },
        {
          title: '상세 사유',
          dataIndex: 'comment',  // DTO에 맞게 수정
          key: 'comment',
          width: '30%',
        },
        {
          title: '조치',
          key: 'action',
          render: (text, record) => (
            <>
                <Link to={`/board/detail/${record.post_id}`}>
              <Button type="link">신고 내용 보기</Button>
                </Link>
              <Button
                type="link"
                danger
                onClick={() => handleUpdateStatus(record.report_id, 'RESOLVED')}  // 'RESOLVED'는 상태 예시
              >
                처리 완료
              </Button>
            </>
          ),
          width: '20%',
        },
      ]}
      dataSource={Array.isArray(reportedPosts) ? reportedPosts : []}
      pagination={false}
      rowKey="post_id"  // DTO에 맞게 수정
      bordered
    />
  );
};

export default ReportedPosts;
