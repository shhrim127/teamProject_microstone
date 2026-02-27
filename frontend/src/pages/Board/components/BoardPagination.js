import React from 'react';

const BoardPagination = ({ currentPage, totalPages, handlePageChange }) => {
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <li key={i} className={`paginate_button page-item ${i === currentPage ? 'active' : ''}`}>
        <a href="#" className="page-link" onClick={() => handlePageChange(i)}>
          {i}
        </a>
      </li>
    );
  }

  return (
    <ul className="pagination">
      {
        <li className="paginate_button page-item previous">
          <a className="page-link" href="#" onClick={() => handlePageChange(currentPage - 1)}>
            <i className="bx bx-chevron-left bx-18px"></i>
          </a>
        </li>
      }
      {pages} 
      {
        <li className="paginate_button page-item next">
          <a className="page-link" href="#" onClick={() => handlePageChange(currentPage + 1)}>
            <i className="bx bx-chevron-right bx-18px"></i>
          </a>
        </li>
        }
    </ul>
  );
};

export default BoardPagination;
