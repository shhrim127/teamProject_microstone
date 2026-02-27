import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import './MyPage.css';
import UserSidebar from './UserSider';
import UserAccount from './UserAccount';
import DataTable from './DataTable';
import UserProfile from './MyPageHeader';
import Swal from 'sweetalert2'
import {getUserInfo} from "../../api/userApi";
import {deactivateUser} from "../../api/DeactivateAccount";
import { useUser } from "../../store/UserContext";
import { formatTimeDifference } from '../../api/util';

const MyPage = () => {
    // 사용자 정보 및 기본 UI 데이터 처리 (상태 관리 추가 가능)
    const [userData, setUserData] = useState({
        id :'',
        nickname: '',
        email: '',
        occupation: '', // 직업
        department: '',
        role: '',
        phone_num: '',
        created_at:'',
        commitcount: 0, // 댓글 작성 수
        writercount: 0, // 게시글 작성 수
    });

    // localStorage에서 기존 정보 가져오기
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userInfo = JSON.parse(storedUser);
            setUserData(prevData => ({
                ...prevData,
                id: userInfo.id || '',
                nickname: userInfo.nickname || '',
                email: userInfo.email || '',
                role: userInfo.role || '',
            }));
        }

        // 추가 정보는 API를 통해 가져오기
        const userId = localStorage.getItem('user_id');
        if (userId) {
            getUserInfo(userId)
                .then(data => {
                    setUserData(prevData => ({
                        ...prevData,
                        occupation: data.occupation || '',
                        department: data.department || '',
                        phone_num: data.phone_num || '',
                        created_at: formatTimeDifference(data.created_at) || '',
                        commitcount: data.commitcount || 0,
                        writercount: data.writercount || 0,
                    }));
                })
                .catch(error => {
                    console.error('유저 정보를 가져오는 중 오류 발생', error);
                });
        }
    }, []);

    const tables = [
        {
          id: 1,
          name: 'Angular Project',
          category: '기술',
          writer: 'Albert Cook',
          comment: 5,
          like: 100,
          created_date: '2024-08-16',
        },
      ];
    const handleChange = (name, value) => {
        setUserData({
          ...userData,
          [name]: value, // 필드의 이름에 따라 동적으로 값 변경
        });
      };


    return (
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                {/* Sidebar */}
                <Sidebar current_page="my_page" />
                <div className='layout-page'>
                    <div className="container-xxl flex-grow-1 container-p-y">
                    <UserProfile 
                        userName={userData.nickname}
                        userGroup={userData.occupation}
                        created_at={userData.created_at}
                        />
                        <div className="row">
                        <UserSidebar
                            id={userData.id}
                            username={userData.nickname}
                            email={userData.email}
                            group={userData.occupation}
                            role={userData.role}
                            department ={userData.department}
                            phone_num={userData.phone_num}
                            created_at={userData.created_at}
                            commitcount={userData.commitcount}
                            writercount={userData.writercount}
                            />

                            <div className="col-xl-8 col-lg-7 order-0 order-md-1">
                                <div className="nav-align-top">
                                    <ul className="nav nav-pills flex-column flex-md-row mb-6">
                                        <NavLink label="계정" icon="bx-user" isActive={true} data_target="account"/>
                                        {/* <NavLink label="작성글" icon="bx-lock-alt" data_target="writer"/> */}
                                        {/* <NavLink label="댓글 조회" icon="bx-detail" data_target="commit"/> */}
                                        {/* <NavLink label="차단유저" icon="bx-bell" data_target="block_users"/> */}
                                    </ul>
                                </div>
                                <div className="tab-content" style={{padding:0,marginBottom:24}}>
                                    <div className="card tab-pane fade show active" id="account" role="tabpanel">
                                        <UserAccount
                                            id={userData.id}
                                            username={userData.nickname}
                                            email={userData.email}
                                            group={userData.occupation}
                                            role={userData.role}
                                            department ={userData.department} //직업 추가
                                            phone_num={userData.phone_num}
                                            created_at={userData.created_at}
                                            commitcount={userData.commitcount}
                                            writercount={userData.writercount}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-6 tab-pane fade" id="writer" role="tabpanel">
                                        <DataTable
                                            tables={tables}
                                        />
                                    </div>
                                    <div className="mb-6 tab-pane fade" id="commit" role="tabpanel">
                                        <DataTable
                                            tables={tables}
                                        />
                                    </div>
                                    <div className="mb-6 tab-pane fade" id="block_users" role="tabpanel">
                                        <DataTable
                                            tables={tables}
                                        />
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <h5 className="card-header">계정 삭제</h5>
                            <div className="card-body">
                                <DeleteAccountForm userData ={userData}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const NavLink = ({ label, icon, isActive = false ,data_target}) => (
    <li className="nav-item">
        <a className={`nav-link ${isActive ? "active" : ""}`} 
            aria-selected={isActive ? "true" : "false"}
            aria-controls={data_target}
            data-bs-target={`#${data_target}`}
            href="javascript:void(0);" 
            role="tab" data-bs-toggle="tab">
            <i className={`bx bx-sm ${icon} me-1_5`}></i> {label}
        </a>
    </li>
);

// Delete Account Form Component
const DeleteAccountForm = (userData) => {
    const [isAccountChecked, setIsAccountChecked] = useState(false); // 체크박스 상태 관리
    const navigate = useNavigate(); 
    const { setUser } = useUser();
  
    const handleSubmit = async (event) => {
      event.preventDefault(); // 페이지 새로고침 방지
  
      let is_true = await Swal.fire({
        title: '경고!',
        text: '계정을 정말 삭제하시겠습니까?',
        icon: 'warning',
        confirmButtonText: '확인',
        showCancelButton: true,
        cancelButtonText: '취소'
      });

      if (is_true.isConfirmed) {
        const response = await deactivateUser()
        if (response.data.result === 'success'){

          //계정 정보 삭제 강제 로그아웃
          localStorage.removeItem('user');
          localStorage.removeItem('user_id');
      
          // UserContext 상태 초기화
          setUser(null);
      
          // 메인 페이지로 리디렉트
          navigate('/');


          Swal.fire({
            title: '성공!',
            html: '계정이 삭제되었습니다. <br><br>한 달 이내에 복구할 수 있습니다.',
            icon: 'success',
            customClass: {
              confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false,
            confirmButtonText: '확인'
          });
        } else{
          console.error(response.data)
          Swal.fire({
            title: '실패!',
            html: '계정 삭제 중에 알 수 없는 오류가 발생했습니다.',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false,
            confirmButtonText: '확인'
          });
        }

      } 
    };
  
    const handleCheckboxChange = (event) => {
      setIsAccountChecked(event.target.checked); // 체크박스 상태 업데이트
    };
  
    return (
      <form id="formAccountDeactivation" onSubmit={handleSubmit}>
        <div className="alert alert-warning">
          <h5 className="alert-heading mb-1">정말 계정을 삭제하시겠습니까?</h5>
          <p className="mb-0">계정을 삭제한 후 30일이 지나면 다시 복구할 수 없습니다.</p>
        </div>
        <div className="form-check my-8 ms-2">
          <input
            className="form-check-input"
            type="checkbox"
            name="accountActivation"
            id="accountActivation"
            onChange={handleCheckboxChange} // 체크박스 상태 변화 감지
          />
          <label className="form-check-label" htmlFor="accountActivation">
            계정 삭제를 확인합니다
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-danger deactivate-account"
          disabled={!isAccountChecked} // 체크박스가 체크되지 않으면 버튼 비활성화
        >
          계정 삭제
        </button>
      </form>
    );
  };

export default MyPage;
