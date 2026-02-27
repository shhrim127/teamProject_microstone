// components/SearchBar.js
import React from 'react';

const SearchBar = ({ searchValue, onSearchChange, onSearchClick }) => {
  return (
    <div className="d-flex align-items-center">
      <div className="input-group me-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="검색어를 입력하세요"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button 
          className="btn btn-outline-primary" 
          type="button"
          onClick={onSearchClick}
        >
          검색
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
