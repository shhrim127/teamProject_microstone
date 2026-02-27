import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DataTable.css';


const BoardPage = ({tables}) => {
  const navigate = useNavigate();
  const [hoveredRow, setHoveredRow] = useState(null);

  const goToContent = () => {
    navigate('/content'); // 컨텐츠 페이지로 이동하는 경로
  };

  const handleMouseEnter = (id) => {
    setHoveredRow(id);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  return (
              <div className="card dataTables_wrapper">
                <div className="card-header flex-column flex-md-row pb-0">
                  <div className="head-label text-center">
                  </div>
                </div>
                <div className="card-datatable table-responsive">
                  <div className="row">
                    <div className="col-sm-12 col-md-6 ps-md-4">
                      <div className="dataTables_length">
                        <label>
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end mt-n6 mt-md-0">
                      <div className="dataTables_filter">
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control" 
                          />
                          <button 
                            className="btn btn-outline-primary" 
                            type="button"
                          >
                            검색
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <table className="dt-multilingual table border-top dataTable no-footer dtr-column collapsed">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>제목</th>
                        <th>카테고리</th>
                        <th>글쓴이</th>
                        <th>댓글</th>
                        <th>추천</th>
                        <th>작성일</th>
                      </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                      {tables.map((table) => (
                        <tr
                          key={table.id}
                          onClick={goToContent}
                          onMouseEnter={() => handleMouseEnter(table.id)}
                          onMouseLeave={handleMouseLeave}
                          className={hoveredRow === table.id ? 'table-light' : ''}
                        >
                          <td>{table.id}</td>
                          <td>{table.name}</td>
                          <td>{table.category}</td>
                          <td>{table.writer}</td>
                          <td>{table.comment}</td>
                          <td>{table.like}</td>
                          <td>{table.created_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="row">
                    <div className="col-sm-12 col-md-6">
                      <div className="dataTables_paginate paging_simple_numbers">
                        <ul className="pagination">
                          <li className="paginate_button page-item previous disabled">
                            <a className="page-link" href="#"><i className="bx bx-chevron-left bx-18px"></i></a>
                          </li>
                          <li className="paginate_button page-item active">
                            <a href="#" className="page-link">1</a>
                          </li>
                          <li className="paginate_button page-item">
                            <a href="#" className="page-link">2</a>
                          </li>
                          <li className="paginate_button page-item">
                            <a href="#" className="page-link">3</a>
                          </li>
                          <li className="paginate_button page-item">
                            <a href="#" className="page-link">4</a>
                          </li>
                          <li className="paginate_button page-item">
                            <a href="#" className="page-link">5</a>
                          </li>
                          <li className="paginate_button page-item next">
                            <a href="#" className="page-link"><i className="bx bx-chevron-right bx-18px"></i></a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div> 
              </div>
  );
};

export default BoardPage;
