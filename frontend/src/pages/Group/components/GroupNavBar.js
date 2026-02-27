import React, { useState } from 'react';
import { Modal, Badge, List, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const GroupNavBar = () => {
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [expandedNotification, setExpandedNotification] = useState(null); // 확장된 알림 상태 저장
  //
  // // 알림 데이터
  // const [notifications, setNotifications] = useState([
  //   {
  //     id: 1,
  //     title: '그룹 가입 승인',
  //     time: '2024/09/19 19:16',
  //     read: false,
  //     details: '당신의 그룹 가입 요청이 승인되었습니다. 그룹에서 여러 활동에 참여하실 수 있습니다. 그룹 관리자는 다양한 기능을 통해 그룹을 관리하고 있습니다.',
  //   },
  //   {
  //     id: 2,
  //     title: '신고 제재 완료',
  //     time: '2024/09/19 17:15',
  //     read: false,
  //     details: '당신이 신고한 게시물에 대해 제재가 완료되었습니다.',
  //   },
  //   {
  //     id: 3,
  //     title: '새로운 그룹 초대',
  //     time: '2024/09/19 14:59',
  //     read: false,
  //     details: '새로운 그룹에 초대되었습니다. 확인해보세요.',
  //   },
  //   {
  //     id: 4,
  //     title: '게시물 댓글 추가',
  //     time: '2024/09/19 13:43',
  //     read: false,
  //     details: '당신의 게시물에 새로운 댓글이 달렸습니다.',
  //   },
  //   {
  //     id: 5,
  //     title: '그룹 관리자 권한 위임',
  //     time: '2024/09/19 12:30',
  //     read: true,
  //     details: '그룹 관리자로 위임되었습니다. 그룹을 관리해주세요.',
  //   },
  //   // 추가 알림들
  //   { id: 6, title: '공지사항 업데이트', time: '2024/09/19 11:22', read: true, details: '새로운 공지사항이 업데이트되었습니다.' },
  //   { id: 7, title: '새로운 게시물 작성됨', time: '2024/09/19 10:10', read: true, details: '새로운 게시물이 작성되었습니다.' },
  //   { id: 8, title: '그룹 초대', time: '2024/09/19 09:50', read: false, details: '새로운 그룹에 초대되었습니다.' },
  //   { id: 9, title: '이벤트 공지', time: '2024/09/18 15:20', read: false, details: '그룹에서 새로운 이벤트가 예정되어 있습니다.' },
  //   { id: 10, title: '댓글 추가', time: '2024/09/18 13:50', read: true, details: '새로운 댓글이 추가되었습니다.' },
  //   { id: 11, title: '경고 알림', time: '2024/09/18 12:30', read: true, details: '그룹 규칙 위반으로 경고가 발송되었습니다.' },
  //   { id: 12, title: '새로운 그룹 승인', time: '2024/09/18 11:10', read: false, details: '당신의 새로운 그룹 가입 요청이 승인되었습니다.' },
  // ]);
  //
  // // 읽지 않은 알림이 있는지 확인하는 함수
  // const hasUnreadNotifications = notifications.some((notif) => !notif.read);
  //
  // const handleNotificationClick = () => {
  //   setIsModalVisible(true);
  // };
  //
  // const handleModalClose = () => {
  //   setIsModalVisible(false);
  // };
  //
  // // 알림을 읽음 상태로 변경하는 함수
  // const markAsRead = (id) => {
  //   setNotifications((prevNotifications) =>
  //     prevNotifications.map((notif) =>
  //       notif.id === id ? { ...notif, read: true } : notif
  //     )
  //   );
  // };
  //
  // // 알림을 삭제하는 함수
  // const deleteNotification = (id) => {
  //   setNotifications((prevNotifications) =>
  //     prevNotifications.filter((notif) => notif.id !== id)
  //   );
  // };
  //
  // // 알림 확장/축소 토글 함수
  // const toggleExpandNotification = (id) => {
  //   if (expandedNotification === id) {
  //     setExpandedNotification(null); // 같은 알림을 클릭하면 축소
  //   } else {
  //     setExpandedNotification(id); // 클릭한 알림 확장
  //     markAsRead(id); // 클릭하면 읽음 상태로 변경
  //   }
  // };

  return (
    <div>
      <ul
        className="nav nav-pills flex-column flex-sm-row mb-6"
        style={{ display: 'flex', alignItems: 'center', height: '38px' }}
      >
        <li className="nav-item" style={{ marginRight: 15 }}>
          <a
            className={`nav-link ${window.location.pathname === '/group/my-group' ? 'active' : ''}`}
            href="/group/my-group"
            style={{ height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <i className="bx bx-user me-1_5 bx-sm"></i> 내가 속한 그룹
          </a>
        </li>
        <li className="nav-item" style={{ marginRight: 15 }}>
          <a
            className={`nav-link ${window.location.pathname === '/group/all' ? 'active' : ''}`}
            href="/group/all"
            style={{ height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <i className="bx bx-group me-1_5 bx-sm"></i> 전체보기
          </a>
        </li>
        <li className="nav-item" style={{ marginRight: 15 }}>
          <a
            className={`nav-link ${window.location.pathname === '/group/create' ? 'active' : ''}`}
            href="/group/create"
            style={{ height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <i className="bx bx-plus"></i> 그룹 만들기
          </a>
        </li>
        <li
          className="nav-item"
          style={{ marginLeft: '25px', height: '100%', display: 'flex', alignItems: 'center' }}
        >
          {/* Badge를 사용해 읽지 않은 알림 여부를 표시 */}
          {/*<Badge dot={hasUnreadNotifications} offset={[-2, 0]}>*/}
          {/*  <BellOutlined*/}
          {/*    style={{ fontSize: '24px', cursor: 'pointer', color: hasUnreadNotifications ? '#ff4d4f' : '#1890ff' }}*/}
          {/*    onClick={handleNotificationClick}*/}
          {/*  />*/}
          {/*</Badge>*/}
        </li>
      </ul>

      {/* Modal for notifications list */}
      {/*<Modal*/}
      {/*  title="알림"*/}
      {/*  visible={isModalVisible}*/}
      {/*  onOk={handleModalClose}*/}
      {/*  onCancel={handleModalClose}*/}
      {/*  footer={null} // 버튼 없음*/}
      {/*  bodyStyle={{ padding: '0' }} // 기본 패딩 제거*/}
      {/*>*/}
      {/*  <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '16px' }}>*/}
      {/*    <List*/}
      {/*      dataSource={notifications}*/}
      {/*      renderItem={(item) => (*/}
      {/*        <>*/}
      {/*          <List.Item*/}
      {/*            style={{*/}
      {/*              backgroundColor: item.read ? 'transparent' : '#ffebeb', // 안 읽은 알림 빨간 배경 강조*/}
      {/*              padding: '10px',*/}
      {/*              display: 'flex',*/}
      {/*              justifyContent: 'space-between',*/}
      {/*            }}*/}
      {/*            onClick={() => toggleExpandNotification(item.id)}*/}
      {/*          >*/}
      {/*            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>*/}
      {/*              <span style={{ color: item.read ? '#000' : '#ff4d4f' }}>{item.title}</span> /!* 안 읽은 알림 빨간색 *!/*/}
      {/*              <span style={{ color: '#888' }}>{item.time}</span>*/}
      {/*            </div>*/}
      {/*            {item.read && (*/}
      {/*              <Button*/}
      {/*                type="link"*/}
      {/*                danger*/}
      {/*                onClick={(e) => {*/}
      {/*                  e.stopPropagation(); // 클릭 이벤트 전파 방지*/}
      {/*                  deleteNotification(item.id);*/}
      {/*                }}*/}
      {/*              >*/}
      {/*                삭제*/}
      {/*              </Button>*/}
      {/*            )}*/}
      {/*          </List.Item>*/}
      {/*          /!* 알림 확장 시 세부 사항 표시 *!/*/}
      {/*          {expandedNotification === item.id && (*/}
      {/*            <div*/}
      {/*              style={{*/}
      {/*                padding: '10px',*/}
      {/*                backgroundColor: '#f6f6f6',*/}
      {/*                border: '1px solid #ddd',*/}
      {/*                maxHeight: '80px',*/}
      {/*                overflowY: 'auto',*/}
      {/*              }}*/}
      {/*            >*/}
      {/*              <p>{item.details}</p>*/}
      {/*            </div>*/}
      {/*          )}*/}
      {/*        </>*/}
      {/*      )}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</Modal>*/}
    </div>
  );
};

export default GroupNavBar;
