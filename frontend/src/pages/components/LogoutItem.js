import React from 'react';
import { one } from '../../pages/images/avatars/avatars'

const LogoutItem = ({text, onClick}) => {
  return (
    <li className='menu-item'>
      <a className="menu-link justify-content-between" onClick={onClick}>
        {/*<div className="avatar avatar-sm me-2"><img src={one} alt="Avatar" className="rounded-circle"/></div>*/}
        <div className="text-truncate">{text}</div>
        <i className='menu-icon tf-icons bx bx-log-out'></i>
      </a>
    </li>
  );
};

export default LogoutItem;
