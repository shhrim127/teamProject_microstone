import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './GenerateAccount.css'; // Import your custom styles
import {checkUserEmail, checkUserId, checkUserNickname, signup} from "../../../../../api/memberApi";

const Register = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    email: '',
    name: '',
    nickname: '',
    phoneNumber: '',
    department: '',
    occupation: '',
  });

  const [errors, setErrors] = useState({});
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Track the current step
  const [showPassword, setShowPassword] = useState(false);  // 비밀번호 보기 상태 추가
  const navigate = useNavigate();

  // 이메일 중복확인
    const [isEmailChecked, setIsEmailChecked] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);  // 비밀번호 표시 상태를 토글
  };

    // 이메일 중복 확인 함수
    const handleCheckEmail = async () => {
        if (!formData.email) {
            setErrors({ ...errors, email: '이메일을 입력해주세요.' });
            return;
        }

        try {
            const isDuplicate = await checkUserEmail(formData.email);
            if (isDuplicate) {
                setErrors({ ...errors, email: '이미 사용 중인 이메일입니다.', email_success: '' });
            } else {
                setErrors({ ...errors, email: '', email_success: '사용 가능한 이메일입니다.' });
                setIsEmailChecked(true);  // 이메일 중복 확인 완료 상태
            }
        } catch (error) {
            setErrors({ ...errors, email: '이메일 중복 확인 중 오류가 발생했습니다.' });
        }
    };

  // Duplicate Check for User ID
  const handleCheckDuplicate = async () => {
    if (!formData.userId) {
      setErrors({ ...errors, userId: '아이디를 입력해주세요.' });
      return;
    }

    try {
      const isDuplicate = await checkUserId(formData.userId);
      if (isDuplicate) {
        setErrors({ ...errors, userId: '이미 사용 중인 아이디입니다.', userId_success: '' });
      } else {
        setErrors({ ...errors, userId: '', userId_success: '사용 가능한 아이디입니다.' });
        setIsIdChecked(true);  // 중복 확인 완료 상태
      }
    } catch (error) {
      setErrors({ ...errors, userId: '아이디 중복 확인 중 오류가 발생했습니다.', userId_success: '' });
    }
  };

  // Duplicate Check for Nickname
  const handleCheckNickname = async () => {
    if (!formData.nickname) {
      setErrors({ ...errors, nickname: '닉네임을 입력해주세요.' });
      return;
    }

    try {
      const isDuplicate = await checkUserNickname(formData.nickname);
      if (isDuplicate) {
        setErrors({ ...errors, nickname: '이미 사용 중인 닉네임입니다.', nickname_success: '' });
      } else {
        setErrors({ ...errors, nickname: '', nickname_success: '사용 가능한 닉네임입니다.' });
        setIsNicknameChecked(true);  // 중복 확인 완료 상태
      }
    } catch (error) {
      setErrors({ ...errors, nickname: '닉네임 중복 확인 중 오류가 발생했습니다.' });
    }
  };

  // 민지0914_회원가입 유효성 검사 완료
    const handleNext = (e) => {
        e.preventDefault();

        let validationErrors = {};

        // 아이디와 닉네임이 비어있는지 확인 (먼저 이 부분을 확인함)
        if (!formData.userId) {
            validationErrors.userId = '아이디를 입력해주세요.';
        }

        if (!formData.nickname) {
            validationErrors.nickname = '닉네임을 입력해주세요.';
        }

        // 이메일 형식 유효성 검사
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailPattern.test(formData.email)) {
            validationErrors.email = '유효한 이메일 주소를 입력해주세요.';
        }

        // 비밀번호 형식 유효성 검사
        if (!formData.password || formData.password.length < 7 || !/^(?=.*[A-Za-z])(?=.*\d).{7,13}$/.test(formData.password)) {
            validationErrors.password = '비밀번호는 7~13자 이내의 문자와 숫자를 포함해야 합니다.';
        }

        // 나머지 필드 확인
        if (!formData.email || !formData.name || !formData.phoneNumber) {
            validationErrors.default = '모든 필드를 입력해주세요.';
        }

        // 중복 확인 여부 체크
        if (!isIdChecked) {
            validationErrors.userId = '아이디 중복 확인을 완료해주세요.';
        }
        if (!isNicknameChecked) {
            validationErrors.nickname = '닉네임 중복 확인을 완료해주세요.';
        }
        // 이메일 중복 확인 여부
        if (!isEmailChecked) {
            validationErrors.email = '이메일 중복 확인을 완료해주세요.';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        } else {
            setErrors({});
            if (currentStep === 1) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

  const handlePrevious = (e) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1); // Move to the previous step
    }
  };
  const goToLogin = () => {
    navigate('/user/login');
  };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'email' && !validateEmail(value)) {
            setErrors({ ...errors, email: '유효한 이메일 주소를 입력해주세요.' });
        } else if (name === 'email') {
            setErrors({ ...errors, email: '' });
        }

        if (name === 'password' && !validatePassword(value)) {
            setErrors({ ...errors, password: '비밀번호는 7자 이상이어야 하며, 문자와 숫자를 포함해야 합니다.' });
        } else if (name === 'password') {
            setErrors({ ...errors, password: '' });
        }
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 7 && /^(?=.*[A-Za-z])(?=.*\d).{7,13}$/.test(password);
    };

  // 민지0914_유효성 검사 함수
    const validateForm = () => {
        let validationErrors = {};

        if (!formData.userId) {
            validationErrors.userId = '아이디를 입력해주세요.';
        }
        if (!validatePassword(formData.password)) {
            validationErrors.password = '비밀번호는 7자 이상이어야 하며, 문자와 숫자를 포함해야 합니다.';
        }
        if (!validateEmail(formData.email)) {
            validationErrors.email = '유효한 이메일 주소를 입력해주세요.';
        }

        return validationErrors;
    };


    const handleChangeNumber = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용

        if (value.length >= 4 && value.length < 8) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length >= 8) {
            value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }

        setFormData({
            ...formData,
            phoneNumber: value
        });
    };


  // 민지0914_폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!isIdChecked || !isNicknameChecked) {
        setErrors({...errors, default: '아이디와 닉네임 중복 확인을 모두 완료해주세요.'});
        return;
    }

    try {
      const response = await signup({
        user_id: formData.userId,
        password: formData.password,
        name: formData.name,
        nickname: formData.nickname,
        phone_num: formData.phoneNumber,
        email: formData.email,
        department: formData.department,
        occupation: formData.occupation,
      });

        alert('회원가입이 완료되었습니다!');
        navigate("/user/login");  // 회원가입 성공 후 페이지 이동
    } catch (error) {
        setErrors({...errors, default: '회원가입 중 오류가 발생했습니다.'});
        console.error(error);
    }
  };

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="px-sm-6 px-0 card">
            <div className="card-body bs-stepper border-none shadow-none mt-5 linear">
              <div className="bs-stepper-header border-none pt-12 px-0">
                <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
                  <button type="button" className="step-trigger" aria-selected={currentStep === 1}>
                    <span className="bs-stepper-circle"><i className="bx bx-home"></i></span>
                    <span className="bs-stepper-label">
                      <span className="bs-stepper-title">계정</span>
                      <span className="bs-stepper-subtitle">계정 정보</span>
                    </span>
                  </button>
                </div>
                <div className="line"><i className="bx bx-chevron-right"></i></div>
                <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
                  <button type="button" className="step-trigger" aria-selected={currentStep === 2} disabled={currentStep !== 2}>
                    <span className="bs-stepper-circle"><i className="bx bx-user"></i></span>
                    <span className="bs-stepper-label">
                      <span className="bs-stepper-title">추가 정보</span>
                      <span className="bs-stepper-subtitle"> 추가 정보</span>
                    </span>
                  </button>
                </div>
              </div>

              <div className="bs-stepper-content px-0">
                <form id="multiStepsForm" onSubmit={handleSubmit}>
                  {/* Step 1: Account Details */}
                  <div className={`content ${currentStep === 1 ? 'active dstepper-block' : ''}`}>
                    <div className="content-header mb-6">
                        {/*민지0914 오타 수정*/}
                        <h4 className="mb-0">계정</h4>
                        <p className="mb-0">계정 정보를 입력해주세요</p>
                    </div>

                        {/* 아이디 Input Field */}
                        <div className="form-group">
                            <label>아이디<span className="text-danger">*</span></label>
                            <div className="input-group">
                                <input
                                type="text"
                                className="form-control"
                                placeholder="아이디 입력"
                                aria-label="아이디 입력"
                                name="userId"
                                id='userId'
                                value={formData.userId}
                                onChange={handleChange}
                                aria-describedby="check-duplicate-btn"
                                />
                                <button 
                                className="btn btn-outline-primary" 
                                type="button" 
                                id="check-duplicate-btn" 
                                onClick={handleCheckDuplicate}>
                                중복 확인
                                </button>
                            </div>
                            {errors.userId && <p className="error">{errors.userId}</p>}
                            {errors.userId_success && <p className="error">{errors.userId_success}</p>}
                        </div>
                        <br/>
                        <div className="form-group">
                            <label>이메일<span className="text-danger">*</span></label>
                            <div className="input-group">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="abc@example.com"
                                    aria-label="이메일 입력"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    aria-describedby="check-email-btn"
                                />
                                <button
                                    className="btn btn-outline-primary"
                                    type="button"
                                    id="check-nickname-btn"
                                    onClick={handleCheckEmail}>
                                    중복확인
                                </button>
                            </div>
                            {errors.email && <p className="error">{errors.email}</p>}
                            {errors.email_success && <p className="error">{errors.email_success}</p>}
                        </div>
                      <br/>
                      {/* 비밀번호 Input Field */}
                      <div className="form-password-toggle">
                          <label htmlFor="password" className="form-label">비밀번호<span className="text-danger">*</span></label>
                            <div className="input-group input-group-merge">
                                <input
                                type={showPassword ? "text" : "password"} 
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="공백 없이 영어, 숫자 포함 7~13자 이내"
                                value={formData.password}
                                onChange={handleChange}
                                />
                                <span className="input-group-text cursor-pointer" onClick={togglePasswordVisibility}>
                                <i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`}></i>
                                </span>
                            </div>
                            {errors.password && <p className="error">{errors.password}</p>}
                        </div>
                        <br/>
                        {/* Name Input Field */}
                        <div className="form-group">
                            <label>이름<span className="text-danger">*</span></label>
                            <div className="input-group">
                                <input
                                type="text"
                                className="form-control"
                                placeholder="이름"
                                aria-label="이름 입력"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                aria-describedby="check-name-btn"
                                />
                            </div>
                            {errors.name && <p className="error">{errors.name}</p>}
                        </div>
                        <br/>
                            {/* Nickname Input Field */}
                        <div className="form-group">
                            <label>닉네임<span className="text-danger">*</span></label>
                            <div className="input-group">
                                <input
                                type="text"
                                className="form-control"
                                placeholder="닉네임"
                                aria-label="닉네임 입력"
                                name="nickname"
                                id="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                aria-describedby="check-nickname-btn"
                                />
                                <button
                                className="btn btn-outline-primary"
                                type="button"
                                id="check-nickname-btn"
                                onClick={handleCheckNickname}>
                                중복확인
                                </button>
                            </div>
                            {errors.nickname && <p className="error">{errors.nickname}</p>}
                            {errors.nickname_success && <p className="error">{errors.nickname_success}</p>}
                        </div>
                        <br/>
                            {/* Phone Number Input Field */}
                        <div className="form-group">
                            <label>전화번호<span className="text-danger">*</span></label>
                            <div className="input-group">
                                <input
                                type="tel"
                                className="form-control"
                                placeholder="010-0000-0000"
                                aria-label="전화번호 입력"
                                name="phoneNumber"
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChangeNumber}
                                aria-describedby="check-phone-btn"
                                />
                            </div>
                            {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
                        </div>
                        <div className="col-12 d-flex justify-content-between mt-4">
                            <button className="btn btn-primary" onClick={goToLogin}>
                            <i className="bx bx-left-arrow-alt bx-sm ms-sm-n2 me-sm-2"></i>
                            <span>로그인</span>
                            </button>
                            <button className="btn btn-primary btn-next" onClick={handleNext} disabled={currentStep === 3}>
                            <span>다음</span>
                            <i className="bx bx-right-arrow-alt bx-sm me-sm-n2"></i>
                            </button>
                        </div>
                  </div>

                  {/* Step 2: Personal Information */}
                  <div className={`content ${currentStep === 2 ? 'active dstepper-block' : ''}`}>
                    <div className="content-header mb-6">
                      <h4 className="mb-0">추가 정보</h4>
                      <p className="mb-0">당신에 대해 더 알려주세요!</p>
                    </div>
                    <div className="form-group departmentGroup">
                        <label>전공<span className="text-danger">*</span></label>
                        <div className="input-group">
                            <select
                            className="form-select"
                            id="inputGroupSelectDepartment"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            aria-label="전공 선택"
                            >
                            <option value="">전공 선택</option>
                            <option value="HUMANITIES">인문대학</option>
                            <option value="SOCIAL_SCIENCES">사회과학대학</option>
                            <option value="NATURAL_SCIENCES">자연과학대학</option>
                            <option value="NURSING">간호대학</option>
                            <option value="BUSINESS">경영대학</option>
                            <option value="ENGINEERING">공과대학</option>
                            <option value="AGRICULTURAL_LIFE_SCIENCES">농업생명과학대학</option>
                            <option value="ART">미술대학</option>
                            <option value="EDUCATION">사범대학</option>
                            <option value="HUMAN_ECOLOGY">생활과학대학</option>
                            <option value="VETERINARY_MEDICINE">수의과대학</option>
                            <option value="PHARMACY">약학대학</option>
                            <option value="MUSIC">음악대학</option>
                            <option value="MEDICAL">의과대학</option>
                            <option value="LIBERAL_ARTS">자유전공학부</option>
                            </select>
                        </div>
                        {errors.department && <p className="error">{errors.department}</p>}
                    </div>
                    <br/>
                    <div className="row">
                        <label>닉네임<span className="text-danger">*</span></label>
                        <div className="col-md mb-md-0 mb-2">
                            <div className={`form-check custom-option custom-option-icon ${ formData.occupation=== 'STUDENT' ? 'checked' : ''}`}>
                            <label className="form-check-label custom-option-content" htmlFor="occupationStudent">
                                <span className="custom-option-body">
                                <i className="bx bx-edit-alt"></i> {/* Icon for Student */}
                                <span className="custom-option-title"> 학생 </span>
                                </span>
                                <input
                                name="occupation"
                                className="form-check-input"
                                type="radio"
                                value="STUDENT"
                                id="occupationStudent"
                                checked={formData.occupation === 'STUDENT'}
                                onChange={handleChange}
                                />
                            </label>
                            </div>
                        </div>
                        <div className="col-md mb-md-0 mb-2">
                            <div className={`form-check custom-option custom-option-icon ${ formData.occupation=== 'EDUCATOR' ? 'checked' : ''}`}>
                            <label className="form-check-label custom-option-content" htmlFor="occupationEducator">
                                <span className="custom-option-body">
                                <i className="bx bx-book-alt"></i> {/* Icon for Educator */}
                                <span className="custom-option-title"> 교육자 </span>
                                </span>
                                <input
                                name="occupation"
                                className="form-check-input"
                                type="radio"
                                value="EDUCATOR"
                                id="occupationEducator"
                                checked={formData.occupation === 'EDUCATOR'}
                                onChange={handleChange}
                                />
                            </label>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className={`form-check custom-option custom-option-icon ${ formData.occupation=== 'NONE' ? 'checked' : ''}`}>
                                <label className="form-check-label custom-option-content" htmlFor="occupationNone">
                                <span className="custom-option-body">
                                <i className="bx bx-no-entry"></i> {/* Icon for None */}
                                <span className="custom-option-title"> 해당 없음 </span>
                                </span>
                                <input
                                name="occupation"
                                className="form-check-input"
                                type="radio"
                                value="NONE"
                                id="occupationNone"
                                checked={formData.occupation === 'NONE'}
                                onChange={handleChange}
                                />
                            </label>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-between mt-4">
                        <button className="btn btn-label-secondary btn-prev" onClick={handlePrevious} disabled={currentStep === 1}>
                        <i className="bx bx-left-arrow-alt bx-sm ms-sm-n2 me-sm-2"></i>
                        <span>이전단계</span>
                        </button>
                        <button className="btn btn-primary btn-submit" onClick={handleSubmit} >
                        <span>전송</span>
                        <i className="bx bx-right-arrow-alt bx-sm me-sm-n2"></i>
                        </button>
                    </div>
                  </div>
                
                  {/* Stepper Control Buttons */}
                  <br/>
                  {errors.default && <div className="alert alert-danger">{errors.default}</div>}
                </form>
              </div>
            </div>
          </div>
          {/* Register Card */}
        </div>
      </div>
    </div>
  );
};

export default Register;
