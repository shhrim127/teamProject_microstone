import React from 'react';
import { Table, Button } from 'antd';
import { Modal, message } from 'antd';

const { confirm } = Modal;

const BannedList = ({ bannedUsers = [], bannedGroups = [], onUnbanUser, onUnbanGroup }) => {
  const showUnbanConfirm = (id, isGroup = false) => {
    const entity = isGroup ? '그룹' : '유저';
    confirm({
      title: `${entity} ${id}의 추방 상태를 해제하시겠습니까?`,
      onOk() {
        if (isGroup) {
          onUnbanGroup(id);
        } else {
          onUnbanUser(id);
        }
      },
      onCancel() {
        message.info(`${entity} 추방 해제가 취소되었습니다.`);
      },
    });
  };

  return (
    <div>
      <h2>추방된 유저 목록</h2>
      <Table
        columns={[
          { title: '유저 ID', dataIndex: 'id', key: 'id', align: 'center' },
          {
            title: '조치',
            key: 'action',
            render: (text, record) => (
              <Button type="link" onClick={() => showUnbanConfirm(record.id)}>
                추방 해제
              </Button>
            ),
          },
        ]}
        dataSource={bannedUsers.map((user) => ({ id: user }))}
        rowKey="id"
        pagination={false}
      />

      <h2 style={{ marginTop: '20px' }}>추방된 그룹 목록</h2>
      <Table
        columns={[
          { title: '그룹 ID', dataIndex: 'id', key: 'id', align: 'center' },
          {
            title: '조치',
            key: 'action',
            render: (text, record) => (
              <Button type="link" onClick={() => showUnbanConfirm(record.id, true)}>
                추방 해제
              </Button>
            ),
          },
        ]}
        dataSource={bannedGroups.map((group) => ({ id: group }))}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default BannedList;
