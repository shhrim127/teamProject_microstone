// import React, { useState } from 'react';
// import { Table, Avatar, Empty } from 'antd';
// import { MessageOutlined } from '@ant-design/icons';

// const LogManagement = () => {
//   // logs 데이터를 비워서 No Data 상태로 설정
//   const [logs] = useState([]);

//   const logColumns = [
//     {
//       title: '로그',
//       key: 'log',
//       render: (record) => (
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <Avatar icon={<MessageOutlined />} style={{ marginRight: '10px', backgroundColor: '#ccc' }} />
//           <div>
//             <strong>{record.user}</strong> 님이 {record.action} <br />
//             <span style={{ color: '#999', fontSize: '12px' }}>{record.time}</span>
//           </div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <Table
//       columns={logColumns}
//       dataSource={logs}  // 데이터가 없으므로 No Data 상태
//       pagination={false}  // 페이지네이션 없이 모든 로그 표시
//       rowKey="id"
//       style={{ width: '100%', margin: '0 auto' }}  // 테이블 너비를 100%로 설정
//       locale={{
//         emptyText: (
//           <Empty
//             description="No Data"
//             image={Empty.PRESENTED_IMAGE_SIMPLE}  // 기본 제공 이미지 사용
//           />
//         ),
//       }}  // 데이터가 없을 때 표시할 텍스트 및 이미지
//     />
//   );
// };

// export default LogManagement;