import React, { useState } from 'react';
import { Button, Input, Space, message, Modal } from 'antd';

const { confirm } = Modal;

const BanUserGroup = ({ onBanUser, onBanGroup }) => {
  const [banId, setBanId] = useState('');
  const [isUser, setIsUser] = useState(true);

  const showBanConfirm = () => {
    const entity = isUser ? '유저' : '그룹';
    confirm({
      title: `${entity} ${banId}을(를) 추방하시겠습니까?`,
      onOk() {
        if (isUser) {
          onBanUser(banId);
        } else {
          onBanGroup(banId);
        }
        setBanId(''); // 입력 필드 초기화
      },
      onCancel() {
        message.info(`${entity} 추방이 취소되었습니다.`);
      },
    });
  };

  return (
    <div className="ban-section">
      <h2>임의의 유저/그룹 추방</h2>
      <Space direction="horizontal">
        <Input
          value={banId}
          onChange={(e) => setBanId(e.target.value)}
          placeholder={isUser ? '추방할 유저 ID 입력' : '추방할 그룹 ID 입력'}
          style={{ width: '300px' }}
        />
        <Button type="primary" danger onClick={showBanConfirm}>
          {isUser ? '유저 추방' : '그룹 추방'}
        </Button>
        <Button onClick={() => setIsUser(!isUser)}>
          {isUser ? '그룹 추방으로 전환' : '유저 추방으로 전환'}
        </Button>
      </Space>
    </div>
  );
};

export default BanUserGroup;
