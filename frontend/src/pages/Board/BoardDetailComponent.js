import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPostBody, updateDetailStatus, postReport, deletePost } from '../../api/DetailPost';
import Swal from 'sweetalert2';
import { formatTimeDifference } from '../../api/util';
import CommentComponent from './components/CommentComponent'; // 댓글 컴포넌트
import './BoardDetailPage.css';

const BoardDetailComponent = ({id}) => {
  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);
  const loggedInUserId = user.id;
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '게시글 제목',
    content: '여기에 게시글 내용이 표시됩니다.',
    author: '작성자',
    createdAt: '0시간 전',
    likes: 0,
    userId: null,
  });

  const loadTableData = async () => {
    try {
      const response_getpage = await getPostBody(id);
      setPost({
        title: response_getpage.title,
        content: response_getpage.content,
        author: response_getpage.nickname,
        createdAt: formatTimeDifference(response_getpage.created_at),
        likes: response_getpage.recommend_num,
        not_recommend_num: response_getpage.not_recommend_num,
        status: response_getpage.status,
      });
    } catch (error) {
      console.error('게시글 데이터를 로드하는 중 오류 발생:', error);
    }
  };

  // 추천 버튼 핸들러
  const handlePostLike = async () => {
    const newStatus = post.status === 'RECOMMEND' ? 'NONE' : 'RECOMMEND';
    const response = await updateDetailStatus(id, newStatus);

    if (newStatus === 'NONE') {
      setPost((prevState) => ({
        ...prevState,
        likes: response.recommend_num,
        status: null,
      }));
    } else {
      setPost((prevState) => ({
        ...prevState,
        likes: response.recommend_num,
        status: 'RECOMMEND',
      }));
      if (post.status === 'NOT_RECOMMEND') {
        setPost((prevState) => ({
          ...prevState,
          not_recommend_num: response.not_recommend_num,
        }));
      }
    }
  };

  // 비추천 버튼 핸들러
  const handlePostUnLike = async () => {
    const newStatus = post.status === 'NOT_RECOMMEND' ? 'NONE' : 'NOT_RECOMMEND';
    const response = await updateDetailStatus(id, newStatus);

    if (newStatus === 'NONE') {
      setPost((prevState) => ({
        ...prevState,
        not_recommend_num: response.not_recommend_num,
        status: null,
      }));
    } else {
      setPost((prevState) => ({
        ...prevState,
        not_recommend_num: response.not_recommend_num,
        status: 'NOT_RECOMMEND',
      }));
      if (post.status === 'RECOMMEND') {
        setPost((prevState) => ({
          ...prevState,
          likes: response.recommend_num,
        }));
      }
    }
  };

  const handlePostReport = async () => {
    const { value: formValues } = await Swal.fire({
      title: '신고',
      html: `
        <div class="text-start">
          <div class="mb-4">
            <label class="form-label">게시글 제목</label>
            <input type="text" class="form-control" value="${post.title}" readonly>
          </div>
          <div class="mb-4">
            <label for="report_type" class="form-label">신고 유형</label>
            <select id="report_type" class="form-select">
              <option value=null>신고 유형을 선택해주세요</option>
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
      preConfirm: () => ({
        report_type: document.getElementById('report_type').value,
        comment: document.getElementById('comment').value,
      }),
      confirmButtonText: '제출',
      cancelButtonText: '취소',
      showCancelButton: true,
    });

    if (formValues) {
      const { report_type, comment } = formValues;
      if (!report_type || !comment.trim()) {
        Swal.fire('오류', '신고 유형 및 상세 내용을 입력해주세요.', 'error');
        return;
      }
      Swal.fire({ title: '신고 접수 중...', didOpen: () => Swal.showLoading() });

      try {
        const reportResponse = await postReport(id, report_type, comment);
        if (reportResponse.status === 200) {
          Swal.fire('신고 접수 완료!', '신고가 성공적으로 접수되었습니다.', 'success');
        } else {
          throw new Error('신고 실패');
        }
      } catch (error) {
        Swal.fire('신고 접수 실패', '서버 오류가 발생했습니다.', 'error');
      }
    }
  };

  const handlePostDelete = async () => {
    const result = await Swal.fire({
      title: '게시글 삭제',
      text: '정말로 이 게시글을 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await deletePost(id);
        if (response.status === 200) {
          Swal.fire('삭제 완료', '게시글이 삭제되었습니다.', 'success');
          navigate('/board/all');
        } else {
          throw new Error('삭제 실패');
        }
      } catch (error) {
        Swal.fire('삭제 실패', '서버 오류가 발생했습니다.', 'error');
      }
    }
  };

  const handlePostUpdate = () => {
    navigate(`/board/write/${id}`);
  };

  useEffect(() => {
    loadTableData();
  }, []);

  return (
    <div className="board-detail-page">
      <div className="post-box">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-meta">
          <span className="post-author">{post.author}</span>
          <span className="post-date">{post.createdAt}</span>
        </div>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }}></div>
        <div className="post-actions">
          <button className={`like-button ${post.status === 'RECOMMEND' ? 'active' : ''}`} onClick={handlePostLike}>
            {post.status === 'RECOMMEND' ? '추천 취소' : '추천'} <i className='bx bx-like'></i> {post.likes}
          </button>
          <button className={`report-button ${post.status === 'NOT_RECOMMEND' ? 'active' : ''}`} onClick={handlePostUnLike}>
            {post.status === 'NOT_RECOMMEND' ? '비추천 취소' : '비추천'} <i className='bx bx-dislike'></i> {post.not_recommend_num}
          </button>
          <button className="report-button" onClick={handlePostReport}>신고</button>
          {(loggedInUserId === post.author||user.role === "ADMIN") &&  (
            <>
              <button className="report-button" onClick={handlePostDelete}>삭제</button>
              <button className="like-button" onClick={handlePostUpdate}>수정</button>
            </>
          )}
        </div>
      </div>
      <div className="comments-section">
        <h3>댓글</h3>
        <CommentComponent 
        post_id={id}
        user = {user}
         />
      </div>
    </div>
  );
};

export default BoardDetailComponent;
