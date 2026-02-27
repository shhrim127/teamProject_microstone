import React, {useEffect, useState} from 'react';
import { Table, Pagination, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import {getGroupMembers} from "../../../../api/StudyGroupApi";

const { Option } = Select;
const { Search } = Input;

const MemberTab = ({ groupId }) => {
  const navigate = useNavigate();
  console.log("여기의 그룹아이디는" + groupId)

  // Mock 데이터 - 실제 데이터는 API로 불러올 수 있습니다.
  // const [members, setMembers] = useState([
  //   { id: 1, nickname: 'RILLA GO', role: '그룹장', joinDate: '2023-01-15' },
  //   { id: 2, nickname: 'STONE DEV', role: '관리자', joinDate: '2023-02-20' },
  //   { id: 3, nickname: 'LILA', role: '일반 멤버', joinDate: '2023-03-10' },
  //   // 다른 멤버들 추가...
  // ]);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]); // 필터링된 멤버 리스트
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const [selectedRole, setSelectedRole] = useState('전체');

  // API를 통해 멤버 데이터를 불러오는 함수
  const fetchGroupMembers = async () => {
    try {
      const response = await getGroupMembers(groupId);
      setMembers(response); // API에서 받은 데이터를 상태에 저장
      setFilteredMembers(response); // 초기 필터링된 데이터도 전체 데이터로 설정
    } catch (error) {
      console.error('멤버 데이터를 가져오는 중 오류 발생:', error);
    }
  };


  // 컴포넌트가 마운트될 때 멤버 데이터를 불러옴
  useEffect(() => {
    fetchGroupMembers();
  }, [groupId]);


  // 권한 필터링
  const handleRoleChange = (value) => {
    setSelectedRole(value);
    if (value === '전체') {
      setFilteredMembers(members);
    } else if (value === '그룹장') {
      setFilteredMembers(members.filter(member => member.role === 'LEADER')); // 'LEADER'만 필터링
    } else if (value === '일반 멤버') {
      setFilteredMembers(members.filter(member => member.role === 'MEMBER')); // 'MEMBER'만 필터링
    }
    setCurrentPage(1); // 필터링 후 페이지를 1로 리셋
  };

  // 검색 기능
  const handleSearch = (value) => {
    const filtered = members.filter(member => member.nickname.toLowerCase().includes(value.toLowerCase()));
    setFilteredMembers(filtered);
    setCurrentPage(1); // 검색 후 페이지를 1로 리셋
  };

  // 현재 페이지에 보여줄 멤버 리스트
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    // {
    // //   title: 'ID',
    // //   dataIndex: 'id',
    // //   key: 'id',
    // //   width: 60
    // // },
    {
      title: '닉네임',
      dataIndex: 'nickname',
      key: 'nickname'
    },
    {
      title: '권한',
      dataIndex: 'role',
      key: 'role',
      width: 150
    },
    // {
    //   title: '가입일',
    //   dataIndex: 'joinDate',
    //   key: 'joinDate',
    //   width: 150
    // }
  ];

  // 네비게이션 함수
  const handleRowClick = (record) => {
    navigate(`/group/${groupId}/member/${record.id}`);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Select
          defaultValue={selectedRole}
          style={{ width: 150 }}
          onChange={handleRoleChange}
        >
          <Option value="전체">전체</Option>
          <Option value="그룹장">그룹장</Option>
          <Option value="일반 멤버">일반 멤버</Option>
        </Select>
        <Search
          placeholder="닉네임 검색"
          onSearch={handleSearch}
          style={{ width: 200 }}
        />
      </div>
      <Table
        dataSource={paginatedMembers}
        columns={columns}
        pagination={false}
        rowKey="id"
        // onRow={(record) => ({
        //   onClick: () => handleRowClick(record),
        // })}
      />
      <Pagination
        current={currentPage}
        total={filteredMembers.length}
        pageSize={pageSize}
        onChange={handlePageChange}
        style={{ marginTop: '16px', textAlign: 'center' }}
      />
    </div>
  );
};

export default MemberTab;
