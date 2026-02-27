import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const PostDetail  = ({ loggedInUserId }) => {
  const [post, setPost] = useState(null); // 게시글 데이터 상태
  const [comments, setComments] = useState([]); // 댓글 상태 관리
  const { postId } = useParams(); // URL에서 게시글 ID 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const [commentText, setCommentText] = useState(''); // 댓글 입력 상태

  // 게시글 데이터를 서버에서 가져오는 함수
  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:4000/posts/${postId}`);
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('게시글 데이터를 가져오는 데 실패했습니다.', error);
      message.error('게시글 데이터를 불러오지 못했습니다.');
    }
  };

  // 댓글 데이터를 서버에서 가져오는 함수
  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:4000/comments?postId=${postId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('댓글 데이터를 가져오는 데 실패했습니다.', error);
      message.error('댓글 데이터를 불러오지 못했습니다.');
    }
  };

  // 게시글 삭제 핸들러
  const handleDeletePost = async () => {
    Swal.fire({
      title: '게시글 삭제',
      text: '정말로 게시글을 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:4000/posts/${postId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            Swal.fire('삭제 완료', '게시글이 삭제되었습니다.', 'success');
            navigate('/group-main'); // 삭제 후 group main 페이지로 이동
          } else {
            throw new Error('삭제 실패');
          }
        } catch (error) {
          console.error('게시글 삭제에 실패했습니다.', error);
          message.error('게시글 삭제에 실패했습니다.');
        }
      }
    });
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId) => {
    Swal.fire({
      title: '댓글 삭제',
      text: '정말로 댓글을 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:4000/comments/${commentId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            Swal.fire('삭제 완료', '댓글이 삭제되었습니다.', 'success');
            fetchComments(); // 댓글 삭제 후 다시 댓글 목록 불러오기
          } else {
            throw new Error('삭제 실패');
          }
        } catch (error) {
          console.error('댓글 삭제에 실패했습니다.', error);
          message.error('댓글 삭제에 실패했습니다.');
        }
      }
    });
  };

  // 댓글 작성 핸들러
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      message.error('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: commentText,
          userId: loggedInUserId,
          postId: postId, // 현재 게시글 ID와 연결
        }),
      });

      if (response.ok) {
        setCommentText(''); // 입력창 비우기
        fetchComments(); // 댓글 목록 다시 불러오기
      } else {
        message.error('댓글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 작성 중 에러가 발생했습니다:', error);
      message.error('댓글 작성 중 에러가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchPost(); // 컴포넌트가 마운트될 때 게시글 데이터를 가져옵니다.
    fetchComments(); // 컴포넌트가 마운트될 때 댓글 데이터를 가져옵니다.
  }, [postId]);

  return (
    <div>
      {post ? (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <Button type="primary" danger onClick={handleDeletePost}>
              게시글 삭제
            </Button>
          </div>

          {/* 댓글 리스트 */}
          <div style={{ marginTop: '40px' }}>
            <h3>댓글</h3>
            {comments.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {comments.map((comment) => (
                  <li key={comment.id} style={{ marginBottom: '10px', background: '#f0f0f0', padding: '10px', borderRadius: '8px' }}>
                    <span>{comment.text}</span>
                    {loggedInUserId === comment.userId && (
                      <Button type="link" danger onClick={() => handleDeleteComment(comment.id)} style={{ marginLeft: '10px' }}>
                        삭제
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>댓글이 없습니다.</p>
            )}

            {/* 댓글 입력 폼 */}
            <form onSubmit={handleCommentSubmit} style={{ marginTop: '20px' }}>
              <textarea
                rows={3}
                placeholder="댓글을 입력하세요"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', borderColor: '#ddd' }}
              />
              <Button type="primary" htmlType="submit" style={{ marginTop: '10px' }}>
                댓글 작성
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <p>게시글을 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default PostDetail ;
