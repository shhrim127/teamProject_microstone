import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { loginPost } from '../api/loginApi'; // loginPost 함수 import

import "./login.css";

const initState = {
    user_id: '',
    password: ''
}

const Login = () => {
    const [isRemembered, setIsRemembered] = useState(false);
    const [loginParam, setLoginParam] = useState({...initState});
    const [error, setError] = useState(''); // 에러 메시지 상태 추가
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleChange = (e) => {
        loginParam[e.target.name] = e.target.value;
        setLoginParam({...loginParam});
    }

    const handleClickLogin = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작 방지
        try {
            const response = await loginPost(loginParam);
            if (response.error != "ERROR_LOGIN_FAILED") { // 성공 시 메인 페이지로 이동
                navigate('/'); // 메인 페이지 경로로 이동
            } else {
                setError('로그인 실패: ' + response.message); // 실패 시 에러 메시지 설정
            }
        } catch (err) {
            setError('로그인 요청 중 오류가 발생했습니다.'); // 요청 중 오류 발생 시 에러 메시지 설정
        }
    }

    const handleCheckboxChange = (e) => {
        setIsRemembered(e.target.checked);
    };

    return (
        <div className="login">
            <Helmet>
                <title>Microstone : 로그인</title>
                <meta name="#" content="#" />
            </Helmet>

            <div className="header-inner">
                <div className="logo"><h1>Microstone</h1></div>
            </div>

            <header></header>

            <div className="panel">
                <form>
                    <div className="id-box">
                        <input type="text" name="user_id" className="id-input" placeholder="ID" value={loginParam.user_id} onChange={handleChange}/>
                    </div>
                    <div className="pw-box">
                        <input type="password" name="password" className="pw-input" placeholder="Password" value={loginParam.password} onChange={handleChange}/>
                    </div>
                    <div className="remember-me">
                        <label className="keep-signed-in">
                            <input
                                type="checkbox"
                                checked={isRemembered}
                                onChange={handleCheckboxChange}
                            /> 로그인 상태 유지
                        </label>
                    </div>
                    {error && <div className="error-message">{error}</div>} {/* 에러 메시지 출력 */}
                    <div className="login-btn">
                        <button type="submit" onClick={handleClickLogin}>로그인</button>
                    </div>
                </form>
                <div className="others">
                    <Link to="/register"> 회원가입</Link>
                    <Link to="/findid">ID 찾기</Link>
                    <Link to="/findpwd">비밀번호 찾기</Link>
                </div>

                <div className="social-login-buttons">
                    <button className="social-login-button kakaotalk">
                        Kakao 계정으로 로그인
                    </button>
                    <button className="social-login-button google">
                        Google 계정으로 로그인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;