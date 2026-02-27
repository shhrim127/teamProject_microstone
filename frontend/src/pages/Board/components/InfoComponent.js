import React from 'react';

const InfoComponent = ({ currentPage, totalPages }) => {
  return (
    <div className="dataTables_info" role="status" aria-live="polite">
      {`현재 페이지: ${currentPage} / ${totalPages}`}
    </div>
  );
};

export default InfoComponent;
