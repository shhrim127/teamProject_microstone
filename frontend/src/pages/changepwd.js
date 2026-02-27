// import React, { useState } from "react";
// import { useNavigate, useLocation } from 'react-router-dom';
// import { resetPassword } from "../api/findPasswordApi"; // API 함수 임포트
// import { Helmet } from 'react-helmet';
// import "./changepwd.css";

// const ChangePassword = () => {
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const navigate = useNavigate();
//     const location = useLocation();

//     // URL에서 password_token 가져오기
//     const queryParams = new URLSearchParams(location.search);
//     const token = queryParams.get('password_token');  // 쿼리 매개변수에서 토큰 추출

//     // 비밀번호 변경 함수
//     const handlePasswordChange = async (e) => {
//         e.preventDefault();

//         // 비밀번호 형식 유효성 검사 (7자 이상, 문자와 숫자 포함)
//         const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{7,13}$/;

//         if (!passwordPattern.test(newPassword)) {
//             setErrorMessage('비밀번호는 7~13자 이내의 문자와 숫자를 포함해야 합니다.');
//             return;
//         }

//         // 비밀번호와 비밀번호 확인이 일치하는지 확인
//         if (newPassword !== confirmPassword) {
//             setErrorMessage('비밀번호가 일치하지 않습니다.');
//             return;
//         }

//         try {
//             // 비밀번호 재설정 API 호출
//             await resetPassword(token, newPassword);
//             alert('비밀번호가 성공적으로 변경되었습니다.');
//             navigate('/user/login'); // 성공 시 로그인 페이지로 이동

//         } catch (error) {
//             setErrorMessage('비밀번호 변경 중 문제가 발생했습니다. 다시 시도해 주세요.');
//         }
//     };

//     return (
//         <div className="change-password">
//             <Helmet>
//                 <title>Microstone : 비밀번호 변경</title>
//                 <meta name="#" content="#" />
//             </Helmet>

//             <div className="header-inner">
//                 <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
//                     <h1>Microstone</h1>
//                 </div>
//             </div>

//             <div className="panel">
//                 <form onSubmit={handlePasswordChange}>
//                     <h2>비밀번호 변경</h2>
//                     <p>변경할 비밀번호를 입력해 주세요.</p>

//                     {errorMessage && <p className="error-message">{errorMessage}</p>}

//                     <div className="change-box">
//                         <label htmlFor="newPassword">새 비밀번호*</label>
                        // <input
                        //     type="password"
                        //     id="newPassword"
                        //     placeholder="비밀번호"
                        //     value={newPassword}
                        //     onChange={(e) => setNewPassword(e.target.value)}
                        // />
//                     </div>

//                     <div className="change-box">
//                         <label htmlFor="confirmPassword">비밀번호 확인*</label>
                        // <input
                        //     type="password"
                        //     id="confirmPassword"
                        //     placeholder="비밀번호 확인"
                        //     value={confirmPassword}
                        //     onChange={(e) => setConfirmPassword(e.target.value)}
                        // />
//                     </div>

//                     <button type="submit" className="change-password-btn">비밀번호 변경</button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ChangePassword;


import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from "../api/findPasswordApi"; // API 함수 임포트
import { Helmet } from 'react-helmet';
import "./changepwd.css";

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [showNewPassword, setShowNewPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
    
    const navigate = useNavigate();
    const location = useLocation();

    // URL에서 password_token 가져오기
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('password_token');  // 쿼리 매개변수에서 토큰 추출

    // 비밀번호 변경 함수
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        // 비밀번호 형식 유효성 검사 (7자 이상, 문자와 숫자 포함)
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{7,13}$/;

        if (!passwordPattern.test(newPassword)) {
            setErrorMessage('비밀번호는 7~13자 이내의 문자와 숫자를 포함해야 합니다.');
            return;
        }

        // 비밀번호와 비밀번호 확인이 일치하는지 확인
        if (newPassword !== confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            // 비밀번호 재설정 API 호출
            await resetPassword(token, newPassword);
            alert('비밀번호가 성공적으로 변경되었습니다.');
            navigate('/user/login'); // 성공 시 로그인 페이지로 이동

        } catch (error) {
            setErrorMessage('비밀번호 변경 중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);  // 새 비밀번호 표시 상태를 토글
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);  // 비밀번호 확인 표시 상태를 토글
    };

    return (
        <div class="container-xxl">
        <div class="authentication-wrapper authentication-basic container-p-y">
          <div class="authentication-inner">
            <div class="card px-sm-6 px-0">
              <div class="card-body">
                <div class="app-brand justify-content-center mb-6">
                    <a href="/" class="app-brand-link gap-2">
                    <span class="app-brand-logo demo">
                    </span>
                    <span class="app-brand-text demo text-heading fw-bold">Microstone</span>
                    </a>
                </div>
                <h4 class="mb-1">비밀번호 변경 🔒</h4>
                <p class="mb-6">변경할 비밀번호를 입력해주세요.</p>
                <form id="formAuthentication" class="mb-6" onSubmit={handlePasswordChange}>
                    <div class="mb-6 form-password-toggle">
                        <label class="form-label" for="password">새 비밀번호</label>
                        <div class="input-group input-group-merge">
                            <input
                                    type={showNewPassword ? "text" : "password"} 
                                    id="newPassword"
                                    placeholder="비밀번호"
                                    class="form-control"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            <span class="input-group-text cursor-pointer" onClick={toggleNewPasswordVisibility}><i class="bx bx-hide"></i></span>
                        </div>
                    </div>
                    <div class="mb-6 form-password-toggle">
                        <label class="form-label" for="password">비밀번호 확인</label>
                        <div class="input-group input-group-merge">
                            <input
                                    type={showConfirmPassword ? "text" : "password"} 
                                    id="confirmPassword"
                                    placeholder="비밀번호 확인"
                                    class="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            <span class="input-group-text cursor-pointer" onClick={toggleConfirmPasswordVisibility}><i class="bx bx-hide"></i></span>
                        </div>
                    </div>
                    <button type="submit" className='btn btn-primary d-grid w-100'>비밀번호 변경</button>
                </form>
                {errorMessage && <div class="alert alert-danger" role="alert">{errorMessage}</div>}
                {/* <div class="text-center">
                    <a href="/user/login" class="d-flex justify-content-center">
                    <i class="bx bx-chevron-left scaleX-n1-rtl me-1"></i>
                    로그인 하기
                    </a>
                </div> */}
              </div>
            </div>
          </div>
        </div>
    </div>
    );
};

export default ChangePassword;