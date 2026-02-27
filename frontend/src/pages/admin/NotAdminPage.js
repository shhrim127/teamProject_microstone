import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css'; // AdminPage용 CSS 파일

const AdminPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // 메인 페이지로 이동
  };

  return (
    <div className="admin-page-container">
      
      <p>관리자가 아니면 이 페이지에 접근할 수 없습니다.</p>
      <button onClick={handleGoHome} className="go-home-button">돌아가기</button>
    </div>
  );
};

export default AdminPage;
