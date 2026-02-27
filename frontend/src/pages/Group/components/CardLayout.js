// components/CardLayout.js
import React from 'react';

const CardLayout = ({ headerContent, bodyContent }) => {
  return (
    <div className="card" style={{ overflowX: 'hidden', width: '100%' }}>
      <div className="card-header flex-column flex-md-row pb-0" style={{ overflowX: 'auto' }}>
        {headerContent}
      </div>
      <div className="card-datatable table-responsive">
        {bodyContent}
      </div> 
    </div>
  );
};

export default CardLayout;
