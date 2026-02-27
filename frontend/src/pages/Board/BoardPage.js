import React from 'react';
import Sidebar from '../components/sidebar';
import BoardComponent from './BoardComponent'; // 게시판 컴포넌트
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 추가

const BoardPageLayout = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const goToWritePage = () => {
    navigate('/board/write'); // 글쓰기 페이지로 이동
  };
  const goToContent = (id) =>{
    navigate(`/board/detail/${id}`);
  }

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Sidebar current_page="board" />
        <div className="layout-page">
          <div className="dataTables_wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              {/* BoardComponent가 이곳에 들어감 */}
              <div className="card" style={{ overflowX: 'hidden', width: '100%' }}>
                <BoardComponent 
                  goToWritePage={goToWritePage} // goToWritePage를 BoardComponent에 전달
                  goToContent={goToContent}
                />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardPageLayout;
