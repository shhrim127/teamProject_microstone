import React from 'react';

const RowComponent = ({ table, goToContent, handleMouseEnter, handleMouseLeave, hoveredRow }) => {
  return (
    <tr
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
  );
};

export default RowComponent;