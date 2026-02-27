import React, {useEffect, useState} from 'react';
import {Table, Button, message} from 'antd';
import {fetchReportList, updateReportStatus} from "../../api/adminApi";
import {Link} from "react-router-dom";

const ReportedComments = () => {

    const [reportedComments, setReportedComments] = useState([]);

    // 신고된 댓글 목록 로드
    const loadReportedComments = async () => {

        try {
            const data = await fetchReportList(1, 'reply');
            setReportedComments(data);
        } catch (error) {
            console.error('신고된 댓글 로드 중 오류 발생:', error);
            message.error('신고된 댓글을 불러오는 중 문제가 발생했습니다.');
        }
    }

    const handleUpdateStatus = async (reportId, newStatus) => {
        try {
            const userString = localStorage.getItem('user');
            const user = JSON.parse(userString);
            const adminId = user.uid; // 사용자 UID 가져오기

            await updateReportStatus(reportId, newStatus, adminId); // 상태 업데이트 API 호출
            message.success('신고 상태가 업데이트되었습니다.');
            loadReportedComments(); // 상태 업데이트 후 리스트 갱신
        } catch (error) {
            console.error('신고 상태 업데이트 중 오류 발생:', error);
            message.error('신고 상태 업데이트에 실패했습니다.');
        }
    }

    useEffect(() => {
        loadReportedComments()
    }, []);

  return (
    <Table
      columns={[
        {
          title: '댓글 ID',
          dataIndex: 'report_id',
          key: 'report_id',
          width: '15%',
          align: 'center',
        },
        {
          title: '댓글 내용',
          dataIndex: 'content',
          key: 'content',
          width: '35%',
        },
        {
          title: '신고 사유',
          dataIndex: 'report_type',
          key: 'report_type',
          width: '30%',
        },
        {
          title: '상세 사유',
          dataIndex: 'comment',
          key: 'comment',
          width: '30%',
        },
        {
          title: '조치',
          key: 'status',
          render: (record) => (
            <>

                <Link to={`/board/detail/${record.post_reply_id}`}>
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
      dataSource={Array.isArray(reportedComments) ? reportedComments : []}
      pagination={false}
      rowKey="report_id"
      bordered
    />
  );
};

export default ReportedComments;
