import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import '../Quiz/QuizSolve.css';
import { useUser } from '../../store/UserContext';
import { useParams,useNavigate } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';
import { getHistoryList,removeToWrongAnswerNote } from '../../api/History';
import Swal from 'sweetalert2';
import {getQuizTable} from '../../api/GetQuizTable';

const QuizSolvePage = () => {
  const { pdf_list,set_pdf_list } = useUser();
  const { setId } = useParams();
  const navigate = useNavigate();

  // 상태 관리
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableState, setTableState] = useState({
    totalElement: 0,
    totalPages: 1,
    currentElements: 0,
  });

  useEffect(() => {
    
    
    const fetchQuizData = async () => {
      try {
        const response = await getHistoryList(currentPage, setId);
        const updatedTableState = {
          totalElement: response?.totalElement || 0,
          totalPages: response?.totalPages > 0 ? response.totalPages : 1,
          currentElements: response?.currentElements || 0,
        };
        const response_ = await getQuizTable(1);
        const newPdfList = response_?.content || [];
        set_pdf_list(newPdfList);
        setQuestions(response.content || []);
        setTableState(updatedTableState);
      } catch (error) {
        console.error('데이터 로드 중 오류 발생:', error);
      }
    };
    console.log(questions)
    fetchQuizData();
  }, [currentPage, setId]);

  // 설명 보기 토글 핸들러
  const handleShowExplanation = () => {
    setShowExplanation((prev) => !prev);
  };

  // 채점하기 핸들러
  const handleShowCorrectAnswer = () => {
    setShowCorrectAnswer(true);
  };

  // 마우스 오버 핸들러
  const handleMouseEnter = (index) => {
    setHoveredRow(index);
  };
  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  // 다음 문제로 이동
  const handleNextQuestion = () => {
    setShowCorrectAnswer(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // 이전 문제로 이동
  const handlePreviousQuestion = () => {
    setShowCorrectAnswer(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 특정 문제로 이동
  const gotoQuiz = (index) => {
    setShowCorrectAnswer(false);
    setCurrentQuestionIndex(index);
  };

  // 사용자 선택 답변 저장
  const handleRadioChange = (event, questionIndex) => {
    const selectedAnswer = event.target.value;
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        selectedAnswer,
      };
      return updatedQuestions;
    });
  };

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = [];
    const { totalPages } = tableState;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 페이지 변경 핸들러
  const handlePageClick = (page) => {
    setCurrentPage(page);
    setCurrentQuestionIndex(0);
  };

  // 이전 페이지로 이동
  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setCurrentQuestionIndex(0);
    }
  };

  // 다음 페이지로 이동
  const handleNextClick = () => {
    if (currentPage < tableState.totalPages) {
      setCurrentPage((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handleRemoveToWrongAnswerNote = async () => {
    const result = await Swal.fire({
      title: '경고!',
      text: '오답노트에서 이 문제를 삭제하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '수락',
      cancelButtonText: '거절',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await removeToWrongAnswerNote(questions[currentQuestionIndex].id);
  
        if (response.status === 200) {
          await Swal.fire({
            title: '성공!',
            text: '오답노트에서 문제를 삭제했습니다.',
            icon: 'success',
          });
          // 데이터 업데이트 로직
          const historyResponse = await getHistoryList(currentPage, setId);
          const updatedTableState = {
            totalElement: historyResponse?.totalElement || 0,
            totalPages: historyResponse?.totalPages > 0 ? historyResponse.totalPages : 1,
            currentElements: historyResponse?.currentElements || 0,
          };
          setQuestions(historyResponse.content || []);
          setTableState(updatedTableState);
        } else if (response.status === 202) {
          await Swal.fire({
            title: '경고!',
            text: '오답노트에서 이미 삭제된 문제입니다!',
            icon: 'warning',
          });
        }
  
      } catch (error) {
        console.error('오답노트 삭제 중 오류 발생:', error);
        await Swal.fire({
          title: '실패!',
          text: '오답노트에서 문제를 삭제하는 데 실패했습니다.',
          icon: 'error',
        });
      }
    } else {
      // 사용자가 삭제를 취소한 경우
      await Swal.fire({
        title: '취소됨',
        text: '삭제가 취소되었습니다.',
        icon: 'info',
        confirmButtonText: '확인',
      });
    }
  };
  
  const handleChangeSetId = (id) =>{
    console.log(id)
    navigate(`/history/${id}/solve`)
  }
  

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        {/* 왼쪽 사이드바 */}
        <Sidebar current_page="history" />
        <div className="layout-page">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="app-chat card overflow-hidden">
                <div className="row g-0">
                  {/* Sidebar Left */}
                  <div className="col app-chat-contacts app-sidebar flex-grow-0 overflow-hidden border-end">
                    <div
                      className="sidebar-header px-4 border-bottom d-flex align-items-center"
                      style={{ paddingTop: 0 }}
                    >
                      <select className="form-select"
                         onChange={(event) => handleChangeSetId(event.target.value)}
                      >
                        {pdf_list && pdf_list.length > 0 ? (
                          pdf_list.map(
                            (material) =>
                              material.status === 'SUCCESS' && (
                                <option
                                  key={material.id}
                                  value={material.id}
                                  selected={material.id === setId}
                                  
                                >
                                  {material.fileName}
                                </option>
                              )
                          )
                        ) : (
                          <option disabled>자료가 없습니다.</option>
                        )}
                      </select>
                    </div>
                    <div
                      className="sidebar-body px-6 pb-6"
                      style={{ paddingTop: 13 }}
                    >
                      <ul className="list-unstyled chat-contact-list py-2 mb-0">
                        {questions.length > 0 &&
                          questions.map((question, index) => (
                            <li
                              key={index}
                              className={`chat-contact-list-item mb-1 ${
                                index === currentQuestionIndex
                                  ? 'active'
                                  : 'border'
                              }`}
                              onMouseEnter={() => handleMouseEnter(index)}
                              onMouseLeave={handleMouseLeave}
                              style={{
                                backgroundColor:
                                  hoveredRow === index &&
                                  currentQuestionIndex !== index
                                    ? '#f0f0f0'
                                    : '',
                              }}
                            >
                              <a
                                className="d-flex align-items-center"
                                onClick={() => gotoQuiz(index)}
                              >
                                <div className="chat-contact-info flex-grow-1 ms-4">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="chat-contact-name text-truncate m-0 fw-normal">
                                      {index + 1 + 10 * (currentPage - 1)} 문제
                                    </h6>
                                  </div>
                                </div>
                              </a>
                            </li>
                          ))}
                      </ul>
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
                  {/* /Sidebar Left */}

                  {/* Content Area */}
                  <div className="col app-chat-history">
                    <div className="chat-history-wrapper">
                      <div className="chat-history-header border-bottom">
                        <div className="d-flex align-items-center">
                          <button
                            type="button"
                            className="btn btn-danger"
                            style={{ height: 42 }}
                            onClick={() => handleRemoveToWrongAnswerNote()}
                          >
                            오답노트 삭제
                          </button>
                        </div>
                      </div>
                      <div className="chat-history-body">
                        {questions.map(
                          (questionObj, questionIndex) =>
                            questionIndex === currentQuestionIndex && (
                              <div className="card" key={questionIndex}>
                                <div className="card-header">
                                  <h4>
                                    {questionIndex + 1 + 10 * (currentPage - 1)}. {questionObj.question}
                                  </h4>
                                </div>
                                <div className="card-body">
                                  <div className="col">
                                    {questionObj.options.map(
                                      (option, optionIndex) => {
                                        const isChecked =
                                          questionObj.selectedAnswer ===
                                          String(optionIndex + 1);
                                        const isCorrect =
                                          questionObj.correct_answer ===
                                          String(optionIndex + 1);
                                        return (
                                          <div
                                            key={optionIndex}
                                            className={`form-check custom-option custom-option-basic ${
                                              !showCorrectAnswer && isChecked
                                                ? 'checked'
                                                : ''
                                            } ${
                                              showCorrectAnswer
                                                ? 'checked'
                                                : ''
                                            } ${
                                              showCorrectAnswer && isCorrect
                                                ? 'form-check-success'
                                                : ''
                                            } ${
                                              showCorrectAnswer &&
                                              !isCorrect &&
                                              isChecked
                                                ? 'form-check-danger'
                                                : ''
                                            }`}
                                          >
                                            <label
                                              className="form-check-label custom-option-content"
                                              htmlFor={`quizOption${optionIndex}`}
                                            >
                                              <input
                                                name={`quizOption${questionIndex}`}
                                                className="form-check-input"
                                                type="radio"
                                                id={`quizOption${optionIndex}`}
                                                value={optionIndex + 1}
                                                checked={isChecked}
                                                onChange={(event) =>
                                                  handleRadioChange(
                                                    event,
                                                    questionIndex
                                                  )
                                                }
                                                disabled={showCorrectAnswer}
                                              />
                                              <span className="custom-option-header">
                                                <small>{option}</small>
                                              </span>
                                              {showExplanation && (
                                                <span className="custom-option-body">
                                                  <small>
                                                    {
                                                      questionObj.explanation[
                                                        optionIndex + 1
                                                      ]
                                                    }
                                                  </small>
                                                </span>
                                              )}
                                            </label>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                        )}
                      </div>
                      <div className="chat-history-footer shadow-xs">
                        <div className="btn-group w-100">
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ height: 42 }}
                            onClick={handlePreviousQuestion}
                          >
                            이전 문제
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ height: 42 }}
                            onClick={handleShowExplanation}
                          >
                            해설 보기
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ height: 42 }}
                            onClick={handleShowCorrectAnswer}
                          >
                            채점 하기
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleNextQuestion}
                            style={{ height: 42 }}
                          >
                            다음 문제
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Content Area */}
                  <div className="app-overlay"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default QuizSolvePage;
