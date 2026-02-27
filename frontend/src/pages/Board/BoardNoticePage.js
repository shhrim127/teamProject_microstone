import React, { useEffect,useState } from 'react';
import { Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import BoardHeader from './components/BoardHeader';
import BoardPagination from './components/BoardPagination';
import TableComponent from './components/TableComponent';
import InfoComponent from './components/InfoComponent';
import { Pagination } from 'react-bootstrap';
import './BoardPage.css';

const { Content } = Layout;

const BoardNoticePage = () => {
  const navigate = useNavigate();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [tables, setTables] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [searchValue, setSearchValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('notice'); 
  const [tableState, setTableState] = useState({
    totalElement: 0,
    totalPages: 1,
    currentElements: 0,
  });
  // const loadTableData = async (page) => {
  //   try {
  //     const response = await getAllPosts(page);
  //     const updatedTableState = {
  //       totalElement: response?.totalElement || 0,
  //       totalPages: response?.totalPages > 0 ? response.totalPages : 1,
  //       currentElements: response?.currentElements || 0,
  //     };
  //     setTableState(updatedTableState);
  //     console.log(tables)
  //     setTables(response.content)
  //   } catch (error) {
  //     console.error('테이블 데이터 로드 중 오류 발생:', error);
  //   }
  // };

  // useEffect(() => {
  //   loadTableData(currentPage);
  // }, [currentPage]);
  const goToContent = () => {
    navigate('/content');
  };

  const handleMouseEnter = (id) => {
    setHoveredRow(id);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  const goToWritePage = () => {
    navigate('/board/write');
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    setCurrentPage(1);
    navigate(`/board/${selectedValue}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchValue);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < tableState.totalPages) {
      setCurrentPage((prev) => prev + 1);
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
        <Pagination className="d-flex justify-content-center">
                    <Pagination.First
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                    />
                    <Pagination.Prev
                      disabled={currentPage === 1}
                      onClick={handlePrevClick}
                    />

                    {getPageNumbers().map((page) => (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePageClick(page)}
                      >
                        {page}
                      </Pagination.Item>
                    ))}

                    <Pagination.Next
                      disabled={currentPage === tableState.totalPages}
                      onClick={handleNextClick}
                    />
                    <Pagination.Last
                      disabled={currentPage === tableState.totalPages}
                      onClick={() => setCurrentPage(tableState.totalPages)}
                    />
                  </Pagination>
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

export default BoardNoticePage;
