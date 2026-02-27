import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../store/UserContext';
import Sidebar from '../components/sidebar';
import { createQuiz } from '../../api/CreateQuiz';
import { getQuizTable } from '../../api/GetQuizTable';
import { Pagination, Dropdown } from 'react-bootstrap';
import { reNamePdf, deletePdf } from '../../api/Delete_Edit_Pdf';
import { getTaskStatus } from '../../api/getTaskStatus';

const QuizPage = () => {
  const navigate = useNavigate();
  const { pdf_list, set_pdf_list } = useUser();

  // 상태 변수 설정
  const [hoveredRow, setHoveredRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableState, setTableState] = useState({
    totalElement: 0,
    totalPages: 1,
    currentElements: 0,
  });

  // 테이블 데이터 로드 함수
  const loadTableData = async (page) => {
    try {
      const response = await getQuizTable(page);
      const updatedTableState = {
        totalElement: response?.totalElement || 0,
        totalPages: response?.totalPages > 0 ? response.totalPages : 1,
        currentElements: response?.currentElements || 0,
      };
      setTableState(updatedTableState);
      set_pdf_list(response?.content || []);
    } catch (error) {
      console.error('테이블 데이터 로드 중 오류 발생:', error);
    }
  };

  // 컴포넌트 마운트 및 currentPage 변경 시 테이블 데이터 로드
  useEffect(() => {
    loadTableData(currentPage);
  }, [currentPage]);

  // 상태에 따른 배지 클래스 설정
  const getBadgeClass = (status) => {
    switch (status) {
      case 'PROGRESS':
        return 'badge bg-label-info me-1';
      case 'SUCCESS':
        return 'badge bg-label-success me-1';
      case 'PENDING':
        return 'badge bg-label-warning me-1';
      default:
        return '';
    }
  };

  // 페이지네이션 핸들러
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

  // 마우스 이벤트 핸들러
  const handleMouseEnter = (index) => {
    setHoveredRow(index);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  // 콘텐츠로 이동
  const goToContent = (id, status) => {
    if (status === 'SUCCESS') {
      navigate(`/quiz/${id}/solve`);
    }
  };

  // 문제 생성 프롬프트
  const createQuizPrompt = async (id, name) => {
    const { value: formValues } = await Swal.fire({
      title: '문제 생성',
      html: `
        <div class="text-start">
          <div class="mb-4">
            <label class="form-label">학술자료 이름</label>
            <input type="text" class="form-control" value="${name}" readonly>
          </div>
          <div class="mb-4">
            <label for="quiz_counts" class="form-label">생성 문제 수</label>
            <input type="number" id="quiz_counts" class="form-control" min="1" max="20" placeholder="1부터 20까지 입력">
          </div>
          <div class="mb-4">
            <label for="combo-box" class="form-label">문제 형태 선택</label>
            <select id="combo-box" class="form-select">
              <option>객관식</option>
            </select>
          </div>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          count: document.getElementById('quiz_counts').value,
        };
      },
      confirmButtonText: '생성',
      cancelButtonText: '취소',
      showCancelButton: true,
    });

    if (formValues) {
      const count = parseInt(formValues.count, 10);

      if (!count || count < 1 || count > 20) {
        Swal.fire('오류', '1부터 20까지의 숫자를 입력해주세요.', 'error');
        return;
      }

      Swal.fire({
        title: '문제 생성 대기 중...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const quizResponse = await createQuiz(id, count);
        if (quizResponse.every((response) => response.status === 200)) {
          Swal.fire({
            title: '문제 생성 완료!',
            text: `${count}개의 문제가 성공적으로 생성되었습니다.`,
            icon: 'success',
          });
          // 필요 시 테이블 데이터 갱신
          loadTableData(currentPage);
        } else {
          Swal.fire({
            title: '문제 생성 실패!',
            text: '문제를 생성하는 동안 오류가 발생했습니다.',
            icon: 'error',
          });
        }
      } catch (error) {
        Swal.fire({
          title: '문제 생성 실패!',
          text: '문제를 생성하는 동안 오류가 발생했습니다.',
          icon: 'error',
        });
      }
    }
  };

  // 페이지 번호 생성
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(tableState.totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // PDF 삭제 함수
  const handleDeletePdf = async (id) => {
    const result = await Swal.fire({
      title: '경고!',
      text: '삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '수락',
      cancelButtonText: '거절',
    });

    if (result.isConfirmed) {
      try {
        const response = await deletePdf(id);

        if (response.status === 200) {
          await Swal.fire({
            title: '성공!',
            text: 'PDF가 성공적으로 삭제되었습니다.',
            icon: 'success',
            confirmButtonText: '확인',
          });
          loadTableData(currentPage);
        }
      } catch (error) {
        console.error('PDF 삭제 중 오류 발생:', error);
        await Swal.fire({
          title: '실패!',
          text: 'PDF 삭제에 실패했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
        });
      }
    } else {
      await Swal.fire({
        title: '취소됨',
        text: '삭제가 취소되었습니다.',
        icon: 'info',
        confirmButtonText: '확인',
      });
    }
  };

  // PDF 이름 변경 함수
  const handleRenamePdf = async (id, oldName) => {
    const { value: newName } = await Swal.fire({
      title: '이름 변경',
      input: 'text',
      inputLabel: '새로운 이름을 입력해주세요:',
      inputPlaceholder: '새로운 이름',
      inputValue: oldName,
      showCancelButton: true,
      confirmButtonText: '수락',
      cancelButtonText: '거절',
    });

    if (newName) {
      if (!newName.trim()) {
        await Swal.fire({
          title: '실패!',
          text: '이름을 입력해야 합니다.',
          icon: 'error',
          confirmButtonText: '확인',
        });
        return;
      }

      try {
        const response = await reNamePdf(id, newName);

        if (response.status === 200) {
          await Swal.fire({
            title: '성공!',
            text: `PDF 이름이 "${newName}"(으)로 변경되었습니다.`,
            icon: 'success',
            confirmButtonText: '확인',
          });
          loadTableData(currentPage);
        }
      } catch (error) {
        console.error('PDF 이름 변경 중 오류 발생:', error);
        await Swal.fire({
          title: '실패!',
          text: 'PDF 이름 변경에 실패했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
        });
      }
    } else {
      await Swal.fire({
        title: '취소됨',
        text: '이름 변경이 취소되었습니다.',
        icon: 'info',
        confirmButtonText: '확인',
      });
    }
  };

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Sidebar current_page="upload" />
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="card">
                <div>
                  <h5 className="card-header">문제집</h5>
                </div>
                <div className="table-responsive text-nowrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>학술자료 이름</th>
                        <th>전처리 상태</th>
                        <th>문제수</th>
                        <th>문제 생성</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {pdf_list && pdf_list.length > 0 ? (
                        pdf_list.map((quiz, index) => (
                          <QuizTableRowWithProgress
                            key={index}
                            quiz={quiz}
                            index={index}
                            hoveredRow={hoveredRow}
                            handleMouseEnter={handleMouseEnter}
                            handleMouseLeave={handleMouseLeave}
                            goToContent={goToContent}
                            createQuizPrompt={createQuizPrompt}
                            handleRenamePdf={handleRenamePdf}
                            handleDeletePdf={handleDeletePdf}
                          />
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">문제집이 없습니다.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <Pagination className="d-flex justify-content-center">
                    <Pagination.First
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                    />
                    <Pagination.Prev
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    />
                    {getPageNumbers().map((page) => (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      disabled={currentPage === tableState.totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
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
  );
};

const QuizTableRowWithProgress = ({
  quiz,
  index,
  hoveredRow,
  handleMouseEnter,
  handleMouseLeave,
  goToContent,
  createQuizPrompt,
  handleRenamePdf,
  handleDeletePdf,
}) => {
  const [progress, setProgress] = useState(0); // 진행 상황 퍼센트
  const [status, setStatus] = useState(quiz.status); // 초기 상태

  useEffect(() => {
    if (status !== 'SUCCESS') {
      // 주기적으로 상태를 확인하는 함수
      const intervalId = setInterval(async () => {
        try {
          const response = await getTaskStatus(quiz.taskId); // 서버에서 task 상태 가져오기
          setStatus(response.state); // 상태 업데이트
          setProgress(response.result.total_status);

          if (response.state === 'SUCCESS' || response.state === 'FAILURE') {
            clearInterval(intervalId); // 상태가 SUCCESS 또는 FAILURE이면 요청 중단
          }
        } catch (error) {
          console.error('Task 상태를 가져오는 중 오류 발생:', error);
          clearInterval(intervalId); // 오류 발생 시 요청 중단
        }
      }, 5000); // 5초 간격으로 요청

      return () => {
        clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 중단
      };
    }
  }, [quiz.taskId, status]);

  return (
    <tr
      key={index}
      onMouseEnter={() => handleMouseEnter(index)}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: hoveredRow === index ? '#f0f0f0' : 'transparent',
      }}
    >
      <td onClick={() => goToContent(quiz.id, quiz.status)}>
        {quiz.fileName}
      </td>
      <td>
        <span className={`badge bg-label-${status === 'PROGRESS' ? 'info' : status === 'SUCCESS' ? 'success' : status === 'PENDING' ? 'warning':'danger'} me-1`}>
          {status}
        </span>
      </td>
      <td>{quiz.numberOfQuestion}</td>
      <td>
        {(status === 'SUCCESS'  || status === 'FAILURE' )? (
          <button
            className="btn btn-primary"
            onClick={() => createQuizPrompt(quiz.id, quiz.fileName)}
            disabled={status === 'FAILURE'}
          >
            문제 생성
          </button>
        ) : (
          <>
            <div className="progress" style={{ marginBottom: '5px' }}>
              <div
                id={`progress-bar-${quiz.taskId}`}
                className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <span id={`progress-text-${quiz.taskId}`}>{progress.toFixed(2)}%</span>
          </>
        )}
      </td>
      <td>
        <Dropdown>
          <Dropdown.Toggle
            as="button"
            type="button"
            className="btn p-0 dropdown-toggle hide-arrow custom-dropdown-toggle"
            id="dropdown-custom"
          >
            <i className="bx bx-dots-vertical-rounded"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu className="custom-dropdown-menu">
            <Dropdown.Item
              onClick={() => handleRenamePdf(quiz.id, quiz.fileName)}
              className="dropdown-item"
            >
              <i className="bx bx-edit-alt me-1"></i> 수정
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleDeletePdf(quiz.id)}
              className="dropdown-item"
            >
              <i className="bx bx-trash me-1"></i> 삭제
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};

export default QuizPage;
