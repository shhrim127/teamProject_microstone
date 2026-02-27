import React, { useState } from 'react';
import { Button, Input, Select } from 'antd';
import Swal from 'sweetalert2'; // SweetAlert2 임포트
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅 사용
import { createPost } from '../../../../api/postApi';
import { useParams } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const WritePost = ({ onSavePost, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(null); // 초기값을 null로 설정
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용
  const { groupId } = useParams();

  const handleSave = async () => {
    // 제목과 내용이 비어있는지 확인
    if (!title || !content || !category) { // category도 체크
      Swal.fire({
        title: '오류',
        text: '제목, 내용을 입력하고 카테고리를 선택해주세요.',
        icon: 'error',
        confirmButtonText: '확인',
      });
      return;
    }
  
    try {
      // 게시글 작성 요청 (createPost API 호출)
      const response = await createPost(title, content, category, true, groupId, "study_group");
  
      // 성공적으로 게시글이 작성되었을 때
      if (response.status === 200) {
        Swal.fire({
          title: '게시글 작성 완료',
          text: '게시글이 성공적으로 작성되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
        }).then(() => {
          navigate('./'); // group main 페이지로 이동
        });
      } else {
        throw new Error('게시글 작성 실패');
      }
    } catch (error) {
      // 오류 발생 시 알림
      Swal.fire({
        title: '게시글 작성 실패',
        text: '게시글을 작성하는 중 문제가 발생했습니다.',
        icon: 'error',
        confirmButtonText: '확인',
      });
      console.error('게시글 작성 중 오류:', error);
    }
  };

  return (
    <div>
      <h2>글쓰기</h2>
      <div style={{ marginBottom: '16px' }}>
        <Input
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Select
          placeholder="카테고리를 선택하세요" // placeholder 설정
          value={category} // 선택된 값을 상태로 관리
          onChange={(value) => setCategory(value)} // 선택 변경 핸들러
          style={{ width: 240 }} // Select 박스 크기
        >
          <Option value="ANNOUNCEMENT_BOARD">공지</Option>
          <Option value="FREE_BOARD">자유</Option>
          <Option value="QUESTION_BOARD">질문</Option>
          <Option value="PROBLEM_SHARE_BOARD">문제공유</Option>
        </Select>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <TextArea
          rows={6}
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <Button type="primary" onClick={handleSave}>저장하기</Button>
        <Button onClick={onCancel} style={{ marginLeft: '8px' }}>취소</Button>
      </div>
    </div>
  );
};

export default WritePost;
