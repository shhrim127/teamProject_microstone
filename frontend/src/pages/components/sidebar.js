import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import MenuItem from './MenuItems'; // 파일명이 MenuItems가 아닌 MenuItem인 점 주의
import LogoutItem from './LogoutItem';
import { useUser } from "../../store/UserContext";
import Menu from "./menu";

const Sidebar = ({ current_page }) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();  // useNavigate 훅 사용

  const [ user_id, setuser_id ] = useState('')

  const loginButton = () => {
    navigate('/user/login');
  };

  const handleBulletinBoardClick = () => {
    navigate('/board/all');  // '게시판' 버튼 클릭 시 '/board/all' 경로로 이동
  };

  const handleGroupClick = () => {
    navigate('/group/my-group');  // '그룹' 버튼 클릭 시 '/group' 경로로 이동
  };

  const handleMyWorkBookClick = () => {
    navigate('/quiz');  // '내 문제집' 버튼 클릭 시 '/upload/file-check' 경로로 이동
  };

  const logoutButton = () => {
    // 로컬 스토리지에서 사용자 정보 제거
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');

    // UserContext 상태 초기화
    setUser(null);

    // 메인 페이지로 리디렉트
    navigate('/');
  };

  // 유저 아이디 부여 로직
  useEffect(() => {
    const userString = localStorage.getItem('user_id');  // 'user_id'에서 값을 가져옴
    if (userString) {
      setuser_id(userString);  // 가져온 값을 user_id에 저장
    }
  }, []);
  // useEffect(() => {
  //   const layoutMenu = document.getElementById('layout-menu');
  //   if (layoutMenu) {
  //     // Menu 클래스를 사용하여 메뉴 동작을 관리
  //     new Menu(layoutMenu, {
  //       animate: true, // 애니메이션 설정
  //       orientation: 'vertical', // 수직 메뉴 설정
  //     });
  //   }
  // }, []);


  return (
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
      <div className="app-brand demo">
        <a href="/" className="app-brand-link">
          <span className="app-brand-text demo menu-text fw-bold ms-2">Microstone</span>
        </a>
        {/* <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto">
          <i className="bx bx-chevron-left bx-sm d-flex align-items-center justify-content-center"></i>
        </a> */}
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        <MenuItem
          current_page={current_page}
          icon="bx bx-home-smile"
          target_page="main_page"
          text="홈"
          url="/"
        />
        <MenuItem
          current_page={current_page}
          icon="bx bx-group"
          target_page="group"
          text="그룹"
          onClick={handleGroupClick}  // '그룹' 버튼 클릭 핸들러 추가
        />
        <MenuItem
          current_page={current_page}
          icon="bx bx-store"
          text="게시판"
          target_page="board"
          onClick={handleBulletinBoardClick}
        />
        <MenuItem
          current_page={current_page}
          icon="bx bx-globe"
          text="내문제집"
          target_page="upload"
          onClick={handleMyWorkBookClick}  // '내 문제집' 버튼 클릭 핸들러 추가
        />
        <li className="menu-header small text-uppercase"></li>
        {user ? (
            <>
              <MenuItem
                  url={'/history'}
                  current_page={current_page}
                  icon="bx bx-history"
                  text="오답노트"
                  target_page="history"
              />
            </> ):
        (<></>
        )}
        {/* 프로필 및 관리자 메뉴 */}
        {user ? (
          <>
            <li className="menu-header small text-uppercase">프로필</li>
            <MenuItem
                // url={`/my-page/${user_id}`}
                // 민지_마이페이지
                url={`/my-page`}
              current_page={current_page}
              icon="bx bx-home"
              text="마이페이지"
              target_page="my_page"
            />
          </>
        ) : (
          <></>
        )}
      </ul>
      <ul className='menu-inner' style={{ height: '150px' }}>
        {user ? (
          <LogoutItem
            text={user.nickname}
            onClick={logoutButton}
          />
        ) : (
          <MenuItem
            icon="bx bx-lock-open-alt"
            target_page="None"
            url="/user/login"
            text="로그인"
            onClick={loginButton}
          />
        )}

        {user && user.role === 'ADMIN' && (
          <MenuItem
            icon="bx bx-wrench"
            text="관리자 페이지"
            url="/admin/dashboard"
            target_page="admin"
          />
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
