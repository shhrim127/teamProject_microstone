import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import ReportedPosts from './ReportedPosts';
import ReportedComments from './ReportedComments';
import BanUserGroup from './BanUserGroup';
import BannedList from './BannedList';
import NotAdminPage from './NotAdminPage';
import axiosInstance from '../../api/tokenApi';  // Axios 인스턴스를 사용
import { BASE_URL } from '../../api/config';   // BASE_URL 상수를 가져오기

import "./AdminDashboard.css";

const { TabPane } = Tabs;

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);  // 관리자인지 여부 확인을 위한 상태

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const token = user.token;

        // API 요청
        const response = await axiosInstance.get(`${BASE_URL}/api/user/verifyingAdmin`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // response.data에서 role을 확인하여 관리자 여부 판단
        if (response.data.role === 'ADMIN') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('관리자 여부 확인 중 오류 발생:', error);
      }
    };

    checkAdminStatus();
  }, []);

  // 관리자가 아닌 경우 AdminPage로 리다이렉트
  if (!isAdmin) {
    return <NotAdminPage />;
  }

  // 관리자인 경우 Admin Dashboard 화면 렌더링
  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <Tabs defaultActiveKey="1">
        {/* {console.log('ReportedPosts 렌더링')} */}
        <TabPane tab="신고된 게시글" key="1">
          <ReportedPosts />
        </TabPane>
        <TabPane tab="신고된 댓글" key="2">
          <ReportedComments />
        </TabPane>
        {/* <TabPane tab="유저/그룹 추방" key="3">
          <BanUserGroup />
        </TabPane> */}
        {/* <TabPane tab="추방된 목록" key="4">
          <BannedList />
        </TabPane> */}
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
