import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, handlePageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="dataTables_paginate paging_simple_numbers">
      <ul className="pagination">
        <li className={`paginate_button page-item previous ${currentPage === 1 ? 'disabled' : ''}`}>
          <a className="page-link" href="#" onClick={() => handlePageChange(currentPage - 1)}>
            <i className="bx bx-chevron-left bx-18px"></i>
          </a>
        </li>
        {[...Array(totalPages).keys()].map((num) => (
          <li
            key={num + 1}
            className={`paginate_button page-item ${currentPage === num + 1 ? 'active' : ''}`}
          >
            <a href="#" className="page-link" onClick={() => handlePageChange(num + 1)}>
              {num + 1}
            </a>
          </li>
        ))}
        <li className={`paginate_button page-item next ${currentPage === totalPages ? 'disabled' : ''}`}>
          <a className="page-link" href="#" onClick={() => handlePageChange(currentPage + 1)}>
            <i className="bx bx-chevron-right bx-18px"></i>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
