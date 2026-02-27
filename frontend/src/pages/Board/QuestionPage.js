import React, { useState } from 'react';  
import { Layout } from 'antd';
import { useNavigate } from 'react-router-dom';


import Sidebar from '../components/sidebar';
import BoardHeader from './components/BoardHeader';
import BoardPagination from './components/BoardPagination';
import TableComponent from './components/TableComponent';
import InfoComponent from './components/InfoComponent';
import './BoardPage.css';

const { Content } = Layout;

const QuestionPage = () => {
  const navigate = useNavigate();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [tables, setTables] = useState([
    {
      id: 1,
      name: '문제 이해가 안되어요.',
      category: '문맹',
      writer: 'SIN LEE',
      comment: 5,
      like: 127,
      created_date: '2024-09-14',
    },
    // 더 많은 데이터를 여기에 추가
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [searchValue, setSearchValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('question'); // 기본값을 '질문'으로 설정

  const goToContent = () => {
    navigate('/content'); // 컨텐츠 페이지로 이동하는 경로
  };

  const handleMouseEnter = (id) => {
    setHoveredRow(id);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  const goToWritePage = () => {
    navigate('/board/write'); // 글쓰기 페이지 경로
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    setCurrentPage(1); // 새 선택 시 페이지를 1로 리셋
    navigate(`/board/${selectedValue}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchValue);
    // 검색 처리 로직 추가
  };

  return (
    <div className="layout-wrapper layout-content-navbar">
    <div className="layout-container">
      <Sidebar current_page="board" />
      <div className="layout-page">
        <div className="dataTables_wrapper">
          <div className="container-xxl flex-grow-1 container-p-y">
          <div className="card" style={{ overflowX: 'hidden', width: '100%' }}>
  <BoardHeader 
    selectedOption={selectedOption}
    handleSelectChange={handleSelectChange}
    goToWritePage={goToWritePage}
    searchValue={searchValue}
    setSearchValue={setSearchValue}
    handleSearch={handleSearch}
  />
  <div className="card-datatable table-responsive mt-4" style={{ overflowX: 'auto' }}>
    <TableComponent 
      tables={tables} 
      goToContent={goToContent}
      handleMouseEnter={handleMouseEnter}
      handleMouseLeave={handleMouseLeave}
      hoveredRow={hoveredRow}
    />
    <div className="row" style={{ margin: 0 }}>
      <div className="col-sm-12 col-md-6">
        <InfoComponent 
          currentPage={currentPage} 
          totalPages={totalPages} 
        />
      </div>
      <div className="col-sm-12 col-md-6">
        <div className="dataTables_paginate paging_simple_numbers">
          <BoardPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            handlePageChange={handlePageChange} 
          />
        </div>
      </div>
    </div>
  </div> 
</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default QuestionPage;
