import React from 'react';

const BoardHeader = ({ selectedOption, handleSelectChange, goToWritePage, searchValue, setSearchValue, handleSearch }) => {
  return (
    <div className="card-header d-flex justify-content-between align-items-center pb-4">
      <div className="head-label text-center">
        <select
          name="DataTables_Table_3_length"
          className="form-select"
          value={selectedOption}
          onChange={handleSelectChange}
        >
          <option value="all">전체</option>
          <option value="notice">공지</option>
          <option value="free">자유</option>
          <option value="question">질문</option>
          <option value="problem_sharing">문제공유</option>
        </select>
      </div>
      <div className="d-flex align-items-center">
        <div className="input-group me-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="검색어를 입력하세요"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button 
            className="btn btn-outline-primary" 
            type="button"
            onClick={handleSearch}
          >
            검색
          </button>
        </div>
        <button
          className="btn btn-secondary create-new btn-primary"
          type="button"
          onClick={goToWritePage}
          style={{ width: '150px', textAlign:'center', alignItems:'center' }} // 패딩 조정
        >
          <span>
            <i className="bx bx-plus bx-sm me-sm-2"></i>
            <span className="d-none d-sm-inline-block">글쓰기</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default BoardHeader;
