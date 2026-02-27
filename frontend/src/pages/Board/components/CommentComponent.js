import React, { useState, useEffect } from 'react';
import './CommentComponent.css'; // 스타일 임포트
import { postDetailCommit, getDetailCommitList, postDetailUpdateCommit,deleteCommentFromServer,reportCommentToServer } from '../../../api/DetailCommit';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { formatTimeDifference } from '../../../api/util';
const CommentComponent = ({ post_id ,user}) => {
  const loggedInUserId = user.id
  const id = post_id
  const [commentText, setCommentText] = useState(''); // 새로운 댓글 입력 텍스트
  const [comments, setComments] = useState([]); // 댓글 목록
  const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글의 ID
  const [editingText, setEditingText] = useState(''); // 수정 중인 댓글의 텍스트

  const loadTableData = async () => {
    try {
      const response_getpage = await getDetailCommitList(id, 1);
      console.log(response_getpage.data);
      console.log(response_getpage.data)
      setComments(response_getpage.data.content || []); // 서버에서 데이터가 없으면 빈 배열로 설정
    } catch (error) {
      console.error('테이블 데이터 로드 중 오류 발생:', error);
      setComments([]); // 오류 발생 시 빈 배열로 설정
    }
  };

  useEffect(() => {
    loadTableData();
  }, []);

  // 댓글 작성 핸들러
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!loggedInUserId) {
      Swal.fire({
        title: '로그인 필요',
        text: '로그인 후 댓글을 작성할 수 있습니다.',
        icon: 'warning',
        confirmButtonText: '확인',
      });
      return;
    }

    // 새로운 댓글 작성 로직
    try {
      const response = await postDetailCommit(id, commentText);

      if (response.status === 200) {
        setCommentText(''); // 입력창 비우기
        loadTableData(); // 댓글 목록을 다시 불러오기

        // 성공 메시지
        Swal.fire({
          title: '성공!',
          text: '댓글이 성공적으로 저장되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
        });
      } else {
        console.error('댓글 저장에 실패했습니다.');
        Swal.fire({
          title: '실패!',
          text: '댓글 저장에 실패했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
        });
      }
    } catch (error) {
      console.error('서버 요청 중 에러가 발생했습니다.', error);
      Swal.fire({
        title: '에러!',
        text: '서버 요청 중 에러가 발생했습니다.',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  // 댓글 수정 핸들러
  const handleCommentUpdate = async (e) => {
    e.preventDefault();

    if (editingCommentId) {
      // 댓글 수정 로직
      try {
        const response = await postDetailUpdateCommit(editingCommentId, editingText); // 수정된 댓글 서버에 저장
        if (response.status === 200) {
          setEditingCommentId(null); // 수정 상태 해제
          setEditingText(''); // 수정 텍스트 초기화
          loadTableData(); // 댓글 목록을 다시 불러오기
          Swal.fire('성공!', '댓글이 성공적으로 수정되었습니다.', 'success');
        } else {
          throw new Error('댓글 수정 실패');
        }
      } catch (error) {
        console.error('댓글 수정 중 오류가 발생했습니다.', error);
        Swal.fire('에러!', '서버 요청 중 문제가 발생했습니다.', 'error');
      }
    }
  };

  // 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId,user_id) => {

    if (loggedInUserId !== user_id) {
      Swal.fire({
        title: '권한 없음',
        text: '본인의 댓글만 삭제할 수 있습니다.',
        icon: 'warning',
        confirmButtonText: '확인',
      });
      return;
    }

    try {
      // 여기에 실제 삭제 요청을 보내는 함수로 수정하세요.
      const response = await deleteCommentFromServer(commentId);

      if (response.status===200) {
        loadTableData(); // 댓글 목록을 다시 불러오기
        Swal.fire({
          title: '삭제 완료!',
          text: '댓글이 성공적으로 삭제되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
        });
      } else {
        Swal.fire({
          title: '삭제 실패!',
          text: '댓글 삭제 중 오류가 발생했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
        });
      }
    } catch (error) {
      console.error('댓글 삭제 중 오류가 발생했습니다:', error);
      Swal.fire({
        title: '서버 오류!',
        text: '댓글 삭제 중 문제가 발생했습니다. 다시 시도해 주세요.',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  // 댓글 수정 버튼 핸들러
  const handleCommentEdit = (comment) => {
    setEditingCommentId(comment.reply_id); // 수정할 댓글의 ID 설정
    setEditingText(comment.content); // 수정할 댓글의 내용을 입력창에 미리 설정
  };

  // 신고 핸들러
  const handleCommentReport = async (commentId) => {
    const { value: formValues } = await Swal.fire({
      title: '댓글 신고',
      html: `
        <div class="text-start">
          <div class="mb-4">
            <label for="report_type" class="form-label">신고 유형</label>
            <select id="report_type" class="form-select">
              <option >신고 유형을 선택해주세요</option>
              <option value="POLITICAL_SLANDER">정당, 정치인 비하 및 선거운동</option>
              <option value="INAPPROPRIATE_CONTENT">게시판 성격에 부적절함</option>
              <option value="LEAK_IMPERSONATION_FRAUD">유출, 사칭, 사기</option>
              <option value="ABUSE_SLURS">욕설, 비하</option>
              <option value="CLICKBAIT_SPAM">낚시, 놀람, 도배</option>
              <option value="COMMERCIAL_ADVERTISEMENT">상업적 광고 및 판매</option>
              <option value="OBSCENE_MATERIAL">음란물</option>
              <option value="ILLEGAL_FILMING_DISTRIBUTION">불법 촬영물 유통</option>
              <option value="OTHER">기타</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="comment" class="form-label">상세 내용</label>
            <input type="text" id="comment" class="form-control" placeholder="상세 내용을 입력해주세요">
          </div>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          report_type: document.getElementById('report_type').value,
          comment: document.getElementById('comment').value,
        };
      },
      confirmButtonText: '제출',
      cancelButtonText: '취소',
      showCancelButton: true,
    });
  
    if (formValues) {
      const { report_type, comment } = formValues;
  
      // 신고 유형 및 상세 내용 검증
      if (!report_type) {
        Swal.fire('오류', '신고 유형을 선택해주세요.', 'error');
        return;
      }
  
      if (!comment || comment.trim() === '') {
        Swal.fire('오류', '상세 내용을 입력해주세요.', 'error');
        return;
      }
  
      Swal.fire({
        title: '신고 접수 중...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
  
      try {
        // 신고 데이터 전송 (reportCommentToServer 함수는 서버로 신고 데이터를 전송하는 임의의 함수로 가정)
        const reportResponse = await reportCommentToServer(commentId, report_type, comment);
  
        if (reportResponse.status === 200) {
          Swal.fire({
            title: '신고 접수 완료!',
            text: '신고가 성공적으로 접수되었습니다.',
            icon: 'success',
            confirmButtonText: '확인',
          });
        } else {
          Swal.fire({
            title: '신고 접수 실패!',
            text: '신고를 접수하는 동안 오류가 발생했습니다.',
            icon: 'error',
            confirmButtonText: '확인',
          });
        }
      } catch (error) {
        Swal.fire({
          title: '신고 접수 실패!',
          text: '서버와의 통신 중 오류가 발생했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
        });
      }
    }
  };

  return (
    <div className="comment-section">
      {/* 댓글 작성 폼 (새 댓글용) */}
      {loggedInUserId || user.role === "ADMIN" ? (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            value={commentText} // 새 댓글 텍스트
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="comment-input"
          />
          <button type="submit" className="comment-submit-button">
            작성
          </button>
        </form>
      ) : (
        <p>로그인 후 댓글을 작성할 수 있습니다.</p> // 로그인하지 않았을 경우 메시지 표시
      )}

      {/* 댓글 목록 */}
      <div className="comments-list">
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.reply_id} className="comment-item">
              {editingCommentId === comment.reply_id ? (
                <form onSubmit={handleCommentUpdate} className="comment-form">
                  <input
                    type="text"
                    value={editingText} // 수정할 댓글의 내용
                    onChange={(e) => setEditingText(e.target.value)} // 수정 중인 댓글의 텍스트 업데이트
                    placeholder="댓글을 수정하세요..."
                    className="comment-input"
                  />
                  <button type="submit" className="comment-submit-button">수정 완료</button>
                </form>
              ) : (
                <>
                  <div className='d-flex justify-content-between'>
                    <span className='text-start me-2 fw-bold'>{comment.nickname}</span>
                    <span className="comment-content text-end">{formatTimeDifference(comment.created_at)}</span>
                  </div>
                  <div className='col d-flex justify-content-between'>
                    <span className="comment-content">{comment.content}</span>
                    <div>
                      <button onClick={() => handleCommentReport(comment.reply_id)} className="report-button ms-2">
                        신고
                      </button>
                      {(loggedInUserId === comment.user_id || user.role === "ADMIN") && (
                        <>
                          <button onClick={() => handleCommentEdit(comment)} className="like-button ms-2">
                            수정
                          </button>
                          <button onClick={() => handleCommentDelete(comment.reply_id,comment.user_id)} className="report-button ms-2">
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default CommentComponent;
