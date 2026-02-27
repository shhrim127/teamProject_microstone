import React, { useState, useEffect } from 'react';
import { Button, Table, Pagination, Select, Input } from 'antd';
import BoardComponent from '../../../Board/BoardComponent';
import EditorComponent from '../../../Board/EditorComponent';
import BoardDetailComponent from '../../../Board/BoardDetailComponent';
import { useParams } from 'react-router-dom';

const BoardTab = () => {
  const { groupId } = useParams();
  const [isMember, setIsMember] = useState(true); // Mock 데이터로 멤버 여부 설정
  const [view, setView] = useState('list'); // 'list', 'write', 'detail' 중 하나의 상태
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글 정보
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState(posts); // 검색된 게시글 리스트

  // 검색 핸들러
  const handleSearch = (value) => {
    const filtered = posts.filter(post => post.title.toLowerCase().includes(value.toLowerCase()));
    setFilteredPosts(filtered);
  };

  const handleWriteClick = () => {
    setView('write'); // 글쓰기 뷰로 전환
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    console.log(post)
    setView('detail'); // 게시글 상세 보기로 전환
  };

  // 새로운 게시글을 서버에 저장하는 함수

  return (
    <div>
      <button className='btn btn-primary mb-4' onClick={() => setView('list')}>게시글 보기</button>
      {isMember ? (
        <div>
          {view === 'list' && (
            <BoardComponent 
            // goToContent ={}
            goToWritePage={handleWriteClick} 
            goToContent = {handlePostClick}
            is_studyGroup={true}
            groupId = {groupId}
          />
          )}

          {view === 'write' && (
            <EditorComponent
            goToContent = {handlePostClick}
            type = "study_group"
            />
          )}

          {view === 'detail' && selectedPost && (
            <BoardDetailComponent
              id={selectedPost}
              is_studyGroup ={true}
            />
          )}
        </div>
      ) : (
        <p>그룹 멤버만 게시판을 볼 수 있습니다. 그룹에 가입해주세요.</p>
      )}
    </div>
  );
};

export default BoardTab;
