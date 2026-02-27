import React from 'react';

const SearchBarComponent = ({ searchValue, setSearchValue, handleSearch }) => {
  return (
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
  );
};

export default SearchBarComponent;
