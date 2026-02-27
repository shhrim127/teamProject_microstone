// import React, { useState } from "react";
// import { Helmet } from 'react-helmet';
// import { useNavigate } from 'react-router-dom';  // useNavigate 훅을 임포트

// import "./findpwd.css";
// import {sendResetPasswordEmail} from "../api/findPasswordApi";

// const FindPassword = () => {
//     const [userId, setUserId] = useState('');
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const navigate = useNavigate();  // useNavigate 훅 사용

//     // 이메일 형식 검증 함수
//     const validateEmail = (email) => {
//         const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return re.test(email);
//     }

//     // Input change 핸들러
//     const handleChange = (e) => { 
//         setUserId(e.target.value);
//         if (validateEmail(e.target.value)) {
//             setErrorMessage('');
//         } else {
//             setErrorMessage('올바른 이메일 양식을 입력해주세요');
//         }
//     }

//     // 팝업 열기 함수
//     const openPopup = async (e) => {
//         e.preventDefault(); // 폼 제출 기본 동작 막기
//         if (validateEmail(userId)) {
//             try {
//                 setIsPopupOpen(true);  // 성공 시 팝업 열기
//                 await sendResetPasswordEmail(userId);
//             } catch (error) {
//                 setErrorMessage('비밀번호 재설정 이메일 전송 중 오류가 발생했습니다.');
//             }
//         } else {
//             setErrorMessage('올바른 이메일 양식을 입력해주세요');
//         }
//     }

//     // 팝업 닫기 함수
//     const closePopup = () => {
//         setIsPopupOpen(false);
//         navigate("/user/login"); // 0913 로그인페이지로 이동해야지 이것드라!!!!!
//     };

//     const handleFindPassword = (e) => {
//         e.preventDefault();
//         if (userId) {
//             setIsPopupOpen(true);
//         }
//     };



//     return (
//         <div className="find-password">
//             <Helmet>
//                 <title>Microstone : 비밀번호 찾기</title>
//                 <meta name="#" content="#" />
//             </Helmet>

//             <div className="header-inner">
//                 <div className="logo"><h1>Microstone</h1></div>
//             </div>

//             <header>
                
//             </header>

//             <div className="panel">
//                 <form>
//                     {errorMessage && <p className="error-message">{errorMessage}</p>}
//                     <div className="id-box">
//                         <input 
//                             type="text" 
//                             name="user_email" 
//                             className="email-input" 
//                             placeholder="가입에 사용된 이메일을 입력해주세요." 
//                             value={userId} 
//                             onChange={handleChange}
//                         />
//                     </div>
                    
//                     <div className="find-password-btn">
//                         {/* 비밀번호 찾기 버튼 클릭 시 팝업 열기 */}
//                         <button onClick={openPopup}>비밀번호 찾기</button>
//                     </div>
//                 </form>
//             </div>

//             {/* 팝업이 열려있을 때만 렌더링 */}
//             {isPopupOpen && (
//                 <div className="overlay">
//                     <div className="popup">
                        // <h5>비밀번호 재설정 메일 발송</h5>

                        // <div className="chk-email-box">
                        //     <p>{ userId }</p>
                        // </div>

                        // <p>위 이메일로 비밀번호 재설정 메일을 발송했습니다.
                        //     이메일을 참고해주세요.
                        // </p>
//                         <button onClick={closePopup}>닫기</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FindPassword;


import React, { useState } from "react";
import { Helmet } from 'react-helmet';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';  // useNavigate 훅을 임포트

import "./findpwd.css";
import {sendResetPasswordEmail} from "../api/findPasswordApi";


const FindPassword = () => {
    const [userId, setUserId] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();  // useNavigate 훅 사용

    // 이메일 형식 검증 함수
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Input change 핸들러
    const handleChange = (e) => { 
        setUserId(e.target.value);
        if (validateEmail(e.target.value)) {
            setErrorMessage('');
        } else {
            setErrorMessage('올바른 이메일 양식을 입력해주세요');
        }
    }

    // 팝업 열기 함수
    const openPopup = async (e,{email}) => {
        e.preventDefault(); // 폼 제출 기본 동작 막기
        if (validateEmail(userId)) {
            try {
                await openPopup_test(e,email);  // 성공 시 팝업 열기
                await sendResetPasswordEmail(userId);
            } catch (error) {
                setErrorMessage('비밀번호 재설정 이메일 전송 중 오류가 발생했습니다.');
            }
        } else {
            setErrorMessage('올바른 이메일 양식을 입력해주세요');
        }
    }
    const openPopup_test = async ({ e,email }) => {
        e.preventDefault(); // 폼 제출 기본 동작 막기
        const is_true = await Swal.fire({
          title: '비밀번호 재설정 메일 발송!',
          text: `${email}\n이메일로 비밀번호 재설정 메일을 발송했습니다.\n 이메일을 참고해주세요.`, // 백틱(``)으로 템플릿 리터럴 사용
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false,
          confirmButtonText: '확인'
        });
      
        if (is_true.isConfirmed) {
          setIsPopupOpen(false); // 팝업 닫기
          navigate("/user/login"); // 로그인 페이지로 이동
        }
      };
      

    // 팝업 닫기 함수
    const closePopup = () => {
        setIsPopupOpen(false);
        navigate("/user/login"); // 0913 로그인페이지로 이동해야지 이것드라!!!!!
    };

    const handleFindPassword = (e) => {
        e.preventDefault();
        if (userId) {
            setIsPopupOpen(true);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateEmail(userId)) {
          setErrorMessage('올바른 이메일 양식을 입력해주세요');
          return;
        }
    
        try {
          // 비밀번호 재설정 이메일 API 호출
          await sendResetPasswordEmail(userId);
          
          // 성공 팝업
          const is_true = await Swal.fire({
            title: '비밀번호 재설정 메일 발송!',
            text: `${userId} 이메일로 비밀번호 재설정 메일을 발송했습니다. 이메일을 참고해주세요.`,
            icon: 'success',
            customClass: {
              confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false,
            confirmButtonText: '확인'
          });
    
          if (is_true.isConfirmed) {
            navigate("/user/login"); // 로그인 페이지로 이동
          }
        } catch (error) {
          setErrorMessage('비밀번호 재설정 이메일 전송 중 오류가 발생했습니다.');
        }
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
                <h4 class="mb-1">비밀번호를 잊으셨나요? 🔒</h4>
                <p class="mb-6">이메일을 입력하시면 비밀번호 재설정을 위한 안내를 보내드리겠습니다.</p>
                <form id="formAuthentication" class="mb-6" onSubmit={handleSubmit}>
                    <div class="mb-6">
                    <label for="email" class="form-label">이메일</label>
                        <input 
                            type="text" 
                            name="user_email" 
                            class="form-control" 
                            placeholder="가입에 사용된 이메일을 입력해주세요." 
                            value={userId} 
                            onChange={handleChange}
                        />
                    </div>
                    <button className='btn btn-primary d-grid w-100' type="submit">비밀번호 찾기</button>
                </form>
                {errorMessage && <div class="alert alert-danger" role="alert">{errorMessage}</div>}
                <div class="text-center">
                    <a href="/user/login" class="d-flex justify-content-center">
                    <i class="bx bx-chevron-left scaleX-n1-rtl me-1"></i>
                    로그인 하기
                    </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className={`modal fade ${isPopupOpen ? 'show' : ''}`} id="addNewCCModal" tabIndex="-1" style={{ display: isPopupOpen ? 'block' : 'none' }} aria-modal={isPopupOpen ? 'true' : 'false'} role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-simple modal-add-new-cc">
            <div className="modal-content">
            <div className="modal-body">
                <button type="button" className="btn-close" onClick={closePopup} data-bs-dismiss="modal" aria-label="Close"></button>

                <div className="text-center mb-6">
                    <h4 className="mb-2">비밀번호 재설정 메일 발송</h4>
                    <p>{ userId }</p>
                </div>
                <p>위 이메일로 비밀번호 재설정 메일을 발송했습니다.
                    이메일을 참고해주세요.
                </p>
                </div>
            </div>
        </div>
        </div> */}
    </div>
    );
};

export default FindPassword;
