import React from 'react';

const MenuItem = ({ icon, text, url, current_page, target_page ,onClick}) => {
  return (
    <li className={`menu-item ${current_page === target_page ? 'active' : ''}`}>
      <a href={url} className="menu-link" onClick={onClick}>
        <i className={`menu-icon tf-icons ${icon}`}></i>
        <div className="text-truncate">{text}</div>
      </a>
    </li>
  );
};

export default MenuItem;
