import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import {useUser} from '../../store/UserContext';
import Sidebar from '../components/sidebar';
import { Pagination } from 'react-bootstrap';
import { getHistoryTalbe } from '../../api/History';

const QuizPage = () => {
  // 문제집 데이터를 배열로 정의
  const navigate = useNavigate();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableState, setTableState] = useState({
    totalElement: 0,
    totalPages: 1,
    currentElements: 0
  });
  const { pdf_list, set_pdf_list } = useUser(); // pdf_list와 set_pdf_list 가져오기
    // 원하는 값을 설정

    useEffect(() => {
      const fetchQuizData = async () => {
        try {
          const response = await getHistoryTalbe(1);
          
          // totalPages가 0이거나 null일 경우 기본값을 1로 설정
          const updatedTableState = {
            totalElement: response?.totalElement || 0,
            totalPages: response?.totalPages && response.totalPages > 0 ? response.totalPages : 1, // 기본값 1
            currentElements: response?.currentElements || 0,
          };
          setTableState(updatedTableState);
    
          // PDF 리스트 설정
          const newPdfList = response?.content || [];
          set_pdf_list(newPdfList);
          console.log(newPdfList)
        } catch (error) {
          console.error('데이터 로드 중 오류 발생:', error);
          // 필요에 따라 에러 처리
        }
      };
    
      fetchQuizData(); // 데이터를 비동기로 가져오는 함수 호출
    }, []); // set_pdf_list가 변경될 때마다 호출

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < 5) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleMouseEnter = (index) => {
    setHoveredRow(index);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };
  const goToContent = (id) => {
    navigate(`/history/${id}/solve`);
  };
  
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(tableState.totalPages, currentPage + 2);
    
    // 시작 페이지에서 마지막 페이지까지의 범위를 배열에 추가
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        {/* 왼쪽 사이드바 */}
        <Sidebar current_page="history" />
        <div className='layout-page'>
          <div className='content-wrapper'>
            <div className='container-xxl flex-grow-1 container-p-y'>
              <div className="card">
                <div>
                  <h5 className="card-header">오답 노트 문제집</h5>
                </div>
                <div className="table-responsive text-nowrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>학술자료 이름</th>
                        <th>문제수</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                    {pdf_list && pdf_list.length > 0 ? (
                        pdf_list.map((quiz, index) => (
                            <tr
                            key={index}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                backgroundColor: hoveredRow === index ? '#f0f0f0' : 'transparent',
                            }}
                            >
                            <td
                            onClick={() => goToContent(quiz.id)}
                            >{quiz.fileName}</td>
                            <td>{quiz.numberOfQuestion}</td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="3">문제집이 없습니다.</td>
                        </tr>
                        )}

                    </tbody>
                  </table>
                  {/* 페이지네이션 컴포넌트 */}
                  <Pagination className="d-flex justify-content-center">
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
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
