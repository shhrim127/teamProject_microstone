import React, {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import './CreateGroupPage.css';
import {createStudyGroup} from "../../api/StudyGroupApi";

const CreateGroupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [groupData, setGroupData] = useState({
    group_name: '',
    group_creater: '',
    max_member_num: 2,
  });

  // 현재 로그인된 사용자의 정보를 가져오는 useEffect
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user'); // 로컬스토리지에서 사용자 정보 가져오기
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setGroupData((prevState) => ({
        ...prevState,
        group_creater: user.nickname, // 그룹 생성자 자동 설정
      }));
    }
  }, []);

  const handleChange = (e) => {
    setGroupData({
      ...groupData,
      [e.target.name]: e.target.value,
    });
  };

  // 그룹 생성 처리 함수
  const handleFinish = async (e) => {
    e.preventDefault();
    try {
      // 그룹 생성 API 호출
      const response = await createStudyGroup(groupData);
      if (response.result === 'success') {
        alert('그룹이 성공적으로 생성되었습니다.');
        navigate('/group/my-group'); // 그룹 생성 후 그룹 리스트 페이지로 이동
      } else {
        alert(`그룹 생성 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('그룹 생성 중 오류 발생:', error);
      alert('그룹 생성 중 오류가 발생했습니다.');
    }
  };

  // 취소 버튼 클릭 시 루트 페이지로 이동
  // 이거 /group 으로 하고싶은데 텅빈 페이지 하얀페이지 이렇게 떠요 수정해주세요
  // 일단 main페이지로 보내게끔 해놨어요 잘 모르겠네요 껄껄껄
  const handleCancel = () => {
    navigate('/group/my-group'); // 취소 시 루트 경로로 이동
  };

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        {/* Sidebar */}
        <Sidebar current_page="group" />

        {/* Main Content */}
        <div className="layout-page">
          {/* Content */}
          <div className="authentication-wrapper authentication-basic container-p-y">
            <div className="authentication-inner">
              <div className="card px-sm-6 px-0">
                <div className="card-body">
                  <div className="app-brand justify-content-center"></div>
                  <form id="formAuthentication" className="mb-6" onSubmit={handleFinish}>
                    <div className="mb-6">
                      <label htmlFor="group_name" className="form-label">
                        그룹이름
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="group_name"
                        name="group_name"
                        value={groupData.group_name}
                        onChange={handleChange}
                        placeholder="그룹이름 입력해주세요"
                        autoFocus
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="group_creater" className="form-label">
                        그룹장
                      </label>
                      <div className="input-group input-group-merge">
                        <input
                          type="text"
                          id="group_creater"
                          name="group_creater"
                          value={groupData.group_creater}
                          onChange={handleChange}
                          className="form-control"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="max_member_num" className="form-label">
                        그룹인원
                      </label>
                      <div className="input-group input-group-merge">
                        <input
                          type="number"
                          className="form-control"
                          value={groupData.max_member_num}
                          onChange={handleChange}
                          name="max_member_num"
                          min="2"
                          max="100"
                        />
                        <span className="input-group-text">명</span>
                      </div>
                    </div>
                    <div className="mb-6">
                      <div className="pt-6">
                        <button
                          type="submit"
                          className="btn btn-primary me-3"
                        >
                          그룹 생성
                        </button>
                        <button
                          type="button"
                          className="btn btn-label-secondary"
                          onClick={handleCancel} // 취소 버튼 클릭 시 루트로 이동
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage;
