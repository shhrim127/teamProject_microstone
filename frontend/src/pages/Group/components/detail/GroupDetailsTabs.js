import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './GroupDetailsTabs';

// 각 탭에 대응하는 컴포넌트를 생성
import MainTab from './MainTab';
import BoardTab from './BoardTab';
import MemberTab from './MemberTab';
import ChatTab from './ChatTab';
import ManagementTab from './ManagementTab';
import MyInfoTab from './MyInfoTab';
import axiosInstance from "../../../../api/tokenApi";
import {BASE_URL} from "../../../../api/config"; // 새롭게 추가된 '내 정보' 탭

const GroupDetailsTabs = () => {
  const location = useLocation(); // 현재 URL 정보를 가져옴
  const navigate = useNavigate(); // 네비게이션을 위해 사용
  const [activeTab, setActiveTab] = useState('main');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isMember, setIsMember] = useState(false); // 사용자가 그룹의 멤버인지 확인하는 상태
  const [isAdmin, setIsAdmin] = useState(false); // 사용자가 그룹의 관리자(leader)인지 확인하는 상태

  const [membersList, setMembersList] = useState([]); // 멤버 리스트 상태 추가

  // 그룹 ID를 추출 (URL에서 추출하는 것으로 가정)
  const groupId = location.pathname.split('/')[2]; // '/group/{groupId}/...' 경로에서 groupId 추출

  useEffect(() => {
    // URL에 따라 activeTab을 설정
    const currentPath = location.pathname.split('/').pop(); // 경로의 마지막 부분을 가져옴

    if (currentPath.includes('board')) {
      setActiveTab('board');
    } else if (currentPath.includes('member')) {
      setActiveTab('member');
    } else if (currentPath.includes('chat')) {
      setActiveTab('chat');
    } else if (currentPath.includes('management')) {
      setActiveTab('management');
    } else if (currentPath.includes('myinfo')) {
      setActiveTab('myinfo'); // '내 정보' 탭
    } else {
      setActiveTab('main');
    }

    // 임시 데이터 또는 API 호출을 통해 그룹 이름과 소개를 가져오기
    //   const fetchGroupInfo = async () => {
    //     const mockGroupInfo = {
    //       name: '그룹 이름', // 그룹 이름
    //     };
    //     setGroupName(mockGroupInfo.name);
    //   };
    //
    //   fetchGroupInfo();
    // }, [location.pathname]);
    //
    // const handleTabChange = (tab, path) => {
    //   setActiveTab(tab);
    //   navigate(path); // 선택된 탭에 맞는 경로로 이동
    // };

    // 그룹 정보 API 호출 함수
    const fetchGroupInfo = async () => {
      try {

        console.log("그룹 아이디는")
        console.log(groupId)

        // 현재 로그인한 사용자의 토큰을 로컬 스토리지에서 가져오기
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        const token = user.token;

        // API 요청 보내기
        const response = await axiosInstance.get(`${BASE_URL}/api/studygroup/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // API 응답에서 그룹 이름과 설명을 설정
        setGroupName(response.data.group_name);
        setGroupDescription(response.data.group_description);

        // 그룹 멤버 정보 API 요청
        const membersResponse = await axiosInstance.get(`${BASE_URL}/api/studygroup/${groupId}/members`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const membersData = membersResponse.data;

        // 현재 사용자가 멤버 리스트에 있는지 확인
        const userId = user.id;
        const isUserMember = membersData.some(member => member.userId === userId);
        setIsMember(isUserMember);


        // 현재 사용자가 그룹의 관리자(LEADER)인지 확인
        const isUserAdmin = membersData.some(member => member.userId === userId && member.role === 'LEADER');
        setIsAdmin(isUserAdmin);
      } catch (error) {
        console.error('그룹 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchGroupInfo(); // 그룹 정보 불러오기
  }, [location.pathname, groupId]);

  const handleTabChange = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'main':
        return <MainTab groupId={groupId}/>;
      case 'board':
        return <BoardTab groupId={groupId}/>;
      case 'member':
        return <MemberTab groupId={groupId}/>;
      case 'chat':
        return <ChatTab groupId={groupId}/>;
      case 'management':
        return <ManagementTab groupId={groupId}/>;
      case 'myinfo':
        return <MyInfoTab groupId={groupId} />; // '내 정보' 탭 렌더링
      default:
        return <MainTab groupId={groupId}/>;
    }
  };

  return (
      <div className="col">
        <h1 className="mt-4">{groupName}</h1>
        <h6 className="mt-4">{groupDescription}</h6>
        <div className="card mb-6">
          <div className="p-0 nav-align-top">
            <ul className="nav nav-tabs" role="tablist" style={{ justifyContent: 'flex-start' }}>
              <li className="nav-item" role="presentation">
                <button
                    className={`nav-link ${activeTab === 'main' ? 'active' : ''}`}
                    onClick={() => handleTabChange('main', `/group/${groupId}/main`)}
                    role="tab"
                    aria-selected={activeTab === 'main'}
                >
                  메인
                </button>
              </li>
              {/* 그룹 멤버인 경우에만 나머지 탭들이 보이도록 조건부 렌더링 */}
              {isMember && (
                  <>
                    <li className="nav-item" role="presentation">
                      <button
                          className={`nav-link ${activeTab === 'board' ? 'active' : ''}`}
                          onClick={() => handleTabChange('board', `/group/${groupId}/board`)}
                          role="tab"
                          aria-selected={activeTab === 'board'}
                      >
                        게시판
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                          className={`nav-link ${activeTab === 'member' ? 'active' : ''}`}
                          onClick={() => handleTabChange('member', `/group/${groupId}/member`)}
                          role="tab"
                          aria-selected={activeTab === 'member'}
                      >
                        멤버
                      </button>
                    </li>
                    {/* 관리자에게만 보이지 않도록 조건 추가 */}
                    {!isAdmin && (
                        <li className="nav-item" role="presentation">
                          <button
                              className={`nav-link ${activeTab === 'myinfo' ? 'active' : ''}`} // '내 정보' 탭 추가
                              onClick={() => handleTabChange('myinfo', `/group/${groupId}/myinfo`)}
                              role="tab"
                              aria-selected={activeTab === 'myinfo'}
                          >
                            내 정보
                          </button>
                        </li>
                    )}
                    <li className="nav-item" role="presentation">
                      <button
                          className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`}
                          onClick={() => handleTabChange('chat', `/group/${groupId}/chat`)}
                          role="tab"
                          aria-selected={activeTab === 'chat'}
                      >
                        채팅
                      </button>
                    </li>
                    {/* 관리자에게만 관리 탭이 보이도록 설정 */}
                    {isAdmin && (
                        <li className="nav-item" role="presentation">
                          <button
                              className={`nav-link ${activeTab === 'management' ? 'active' : ''}`}
                              onClick={() => handleTabChange('management', `/group/${groupId}/management`)}
                              role="tab"
                              aria-selected={activeTab === 'management'}
                          >
                            관리
                          </button>
                        </li>
                    )}
                  </>
              )}
            </ul>
          </div>

          <div className="tab-content">
            {renderActiveTab()} {/* 현재 활성화된 탭의 콘텐츠를 렌더링 */}
          </div>
        </div>
      </div>
  );
};

export default GroupDetailsTabs;
