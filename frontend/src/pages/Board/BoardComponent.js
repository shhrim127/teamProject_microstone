import React, { useState, useEffect } from 'react';
import { Pagination } from 'react-bootstrap';
import { getAllPosts } from '../../api/AllPosts';
import { switchCategory } from '../../api/util';
import TableComponent from './components/TableComponent';
import InfoComponent from './components/InfoComponent';
import BoardHeader from './components/BoardHeader';
import './BoardPage.css'

const BoardComponent = ({ goToWritePage ,goToContent , is_studyGroup = false,groupId=0}) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [tables, setTables] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOption, setSelectedOption] = useState('all'); // 카테고리 옵션
  const [currentPage, setCurrentPage] = useState(1); // 페이지 상태 관리
  const [searchValue, setSearchValue] = useState(''); // 검색 상태 관리
  const [tableState, setTableState] = useState({
    totalElement: 0,
    totalPages: 1,
    currentElements: 0,
  });
  const type = is_studyGroup ? "study_group" : "public"

  const loadTableData = async (page, page_type) => {
    try {
      const response = await getAllPosts(page, page_type,type,groupId);
      const updatedTableState = {
        totalElement: response?.totalElement || 0,
        totalPages: response?.totalPages > 0 ? response.totalPages : 1,
        currentElements: response?.currentElements || 0,
      };
      setTableState(updatedTableState);
      setTables(response.content);
    } catch (error) {
      console.error('테이블 데이터 로드 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    loadTableData(currentPage, selectedOption || 'all');
  }, [currentPage, selectedOption]);

  const handlePageClick = (page) => {
    setCurrentPage(page); // 페이지 변경
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < tableState.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(tableState.totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    setCurrentPage(1); 
    loadTableData(1, switchCategory(selectedValue));
  };

  const handleSearch = () => {
    console.log('Searching for:', searchValue);
    loadTableData(1, selectedOption); // 검색 처리 후 데이터 로드
  };

  return (
    <>
      {/* 헤더 */}
      <BoardHeader
        selectedOption={selectedOption}
        handleSelectChange={handleSelectChange}
        goToWritePage={goToWritePage}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
      />

      {/* 테이블 */}
      <div className="card-datatable table-responsive mt-4" style={{ overflowX: 'auto' }}>
        <TableComponent
          tables={tables}
          goToContent={goToContent}
          hoveredRow={hoveredRow}
          handleMouseEnter={(id) => setHoveredRow(id)}
          handleMouseLeave={() => setHoveredRow(null)}
        />
        
        {/* 페이지네이션 */}
        <div className="row" style={{ margin: 0 }}>
          <div className="col-sm-12 col-md-6">
            <InfoComponent currentPage={currentPage} totalPages={totalPages} />
          </div>
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_paginate paging_simple_numbers">
            <Pagination>
                    <Pagination.First disabled={currentPage === 1} onClick={() => setCurrentPage(1)} />
                    <Pagination.Prev disabled={currentPage === 1} onClick={handlePrevClick} />

                    {getPageNumbers().map((page) => (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePageClick(page)}
                      >
                        {page}
                      </Pagination.Item>
                    ))}

                    <Pagination.Next disabled={currentPage === tableState.totalPages} onClick={handleNextClick} />
                    <Pagination.Last disabled={currentPage === tableState.totalPages} onClick={() => setCurrentPage(tableState.totalPages)} />
                  </Pagination>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardComponent;
