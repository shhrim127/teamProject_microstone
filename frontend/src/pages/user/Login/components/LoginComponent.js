import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { loginPost } from '../../../../api/loginApi'; 
import kakaoIcon from '../../../images/icon/social_kakao_icon.svg';
import googleIcon from '../../../images/icon/social_google_icon.svg';
import './LoginComponent.css';
import { getKakaoLoginLink } from '../../../../api/kakaoApi';
import { getGoogleLoginLink } from '../../../../api/googleApi';
import { useUser } from '../../../../store/UserContext';

const initState = {
  user_id: '',
  password: ''
};

const LoginComponent = () => {
  const [showPassword, setShowPassword] = useState(false);  // 비밀번호 보기 상태 추가
  const kakaoLoginLink = getKakaoLoginLink();
  const googleLoginLink = getGoogleLoginLink();
  const [loginParam, setLoginParam] = useState({ ...initState });
  const [isRemembered, setIsRemembered] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleChange = (e) => {
    setLoginParam({
      ...loginParam,
      [e.target.name]: e.target.value
    });
  };

  const handleClickLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginPost(loginParam);

      // 0913 또 날아가면 죽어버릴거임
      const userInfo = {
        id: response.user_id,
        nickname: response.nickname,
        email: response.email,
        role: response.role,
        token: response.access_token
      };
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));

      localStorage.setItem("user_id", userInfo.id)

      if (response.error !== 'ERROR_LOGIN_FAILED') {
        navigate('/');
      } else {
        setError('아이디 또는 비밀번호가 잘못 되었습니다');
      }
    } catch (err) {
      setError('아이디 또는 비밀번호가 잘못 되었습니다');
    }
  };

  const handleCheckboxChange = () => {
    setIsRemembered(!isRemembered);
  };

  const handleKakaoClick = () => {
    window.location.href = kakaoLoginLink;
  };

  const handleGoogleClick = () => {
    window.location.href = googleLoginLink;
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);  // 비밀번호 표시 상태를 토글
  };

  return (
    <div className="container-xxl">
      <Helmet>
        <title>로그인</title>
        <meta name="description" content="로그인 페이지" />
      </Helmet>

      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card px-sm-6 px-0">
            <div className="card-body">
              <div className="app-brand justify-content-center">
                <Link to="/" className="app-brand-link gap-2">
                  <span className="app-brand-logo demo">
                    {/* 로고 이미지나 SVG 여기에 삽입 */}
                  </span>
                  <span className="app-brand-text demo text-heading fw-bold">Microstone</span>
                </Link>
              </div>
              <form id="formAuthentication" className="mb-6" onSubmit={handleClickLogin}>
                <div className="mb-6">
                  <label htmlFor="email" className="form-label">아이디</label>
                  <input
                    type="text"
                    className="form-control"
                    id="user_id"
                    name="user_id"
                    placeholder="아이디를 입력해주세요"
                    value={loginParam.user_id}
                    onChange={handleChange}
                    autoFocus
                  />
                </div>
                <div className="mb-6 form-password-toggle">
                  {/*0913 제발 충돌 그만 스타삣*/}
                  <label htmlFor="password" className="form-label">비밀번호</label>
                  <div className="input-group input-group-merge">
                    <input
                      type={showPassword ? "text" : "password"} 
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="••••••••••••"
                      value={loginParam.password}
                      onChange={handleChange}
                    />
                    <span className="input-group-text cursor-pointer" onClick={togglePasswordVisibility}>
                      <i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`}></i>
                    </span>
                  </div>
                </div>
                <div className="mb-8 d-flex justify-content-between mt-8">
                  <Link to="/user/findpwd">
                    <span>비밀번호 찾기</span>
                  </Link>
                  <Link to="/user/generate"> 회원가입</Link>
                </div>
                <div className="mb-6">
                  <button className="btn btn-primary d-grid w-100" type="submit">
                    로그인
                  </button>
                </div>
                <div className="form-check mb-0 ms-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember-me"
                      checked={isRemembered}
                      onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label">
                      로그인 상태 유지
                    </label>
                  </div>
              </form>
              {error && <div className="alert alert-danger">{error}</div>}
              <div class="divider my-6">
                <div class="divider-text">or</div>
              </div>
              <div class="d-flex justify-content-center">
                <a onClick={handleKakaoClick} class="btn btn-sm btn-icon rounded-circle btn-text-facebook me-1_5">
                  <img src={kakaoIcon} alt="Kakao" className="icon" style={{width: "30px", height: "30px" }} />
                </a>
                <a onClick={handleGoogleClick} class="btn btn-sm btn-icon rounded-circle btn-text-twitter me-1_5">
                  <img src={googleIcon} alt="Google" className="icon" style={{width: "30px", height: "30px" }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
