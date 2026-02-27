import React from 'react';
import Sidebar from '../components/sidebar'; // 사이드바 컴포넌트
import { useParams } from 'react-router-dom';
import BoardDetailComponent from './BoardDetailComponent'; // 기능 컴포넌트

const BoardDetailPageLayout = () => {
  const { id } = useParams();

  return (
    <div className="layout-wrapper">
      <Sidebar current_page="board" />
      <div className="layout-container">
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
            <BoardDetailComponent 
            id = {id}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDetailPageLayout;
