import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkUserNickname, saveAdditionalInfo } from "../../../../../api/memberApi";
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        phoneNumber: '',
        department: '',
        occupation: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const [isNicknameChecked, setIsNicknameChecked] = useState(false);

    // 학과 선택 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // 직업 선택 처리
    const handleButtonClick = (job) => {
        setFormData({
            ...formData,
            occupation: job
        });
    };

    // 전화번호 입력 처리
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

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.name) newErrors.name = "이름을 입력해주세요.";
        if (!formData.nickname) newErrors.nickname = "닉네임을 입력해주세요.";
        if (!formData.phoneNumber) newErrors.phoneNumber = "전화번호를 입력해주세요.";
        if (!formData.department) newErrors.department = "학과를 선택해주세요.";
        if (!formData.occupation) newErrors.occupation = "직업을 선택해주세요.";

        if (!isNicknameChecked) {
            newErrors.nickname = "닉네임 중복 확인을 해주세요.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const userId = localStorage.getItem('user_id');
            const additionalInfo = {
                user_id: userId,
                name: formData.name,
                nickname: formData.nickname,
                phone_num: formData.phoneNumber,
                department: formData.department,
                occupation: formData.occupation
            };
            const result = await saveAdditionalInfo(userId, additionalInfo);
            alert(result);
            navigate('/user/login');
        } catch (error) {
            alert('추가 정보 저장 중 오류 발생: ' + error.message);
        }
    };

    const handleCheckNickname = async () => {
        if (!formData.nickname) {
            setErrors({ ...errors, nickname: '닉네임을 입력해주세요.' });
            return;
        }

        try {
            const isDuplicate = await checkUserNickname(formData.nickname);
            if (isDuplicate) {
                setErrors({ ...errors, nickname: '이미 사용 중인 닉네임입니다.', nickname_success: ''  });
            } else {
                setErrors({ ...errors, nickname: '', nickname_success: '사용 가능한 닉네임입니다.' });
                setIsNicknameChecked(true);
            }
        } catch (error) {
            setErrors({ ...errors, nickname: '닉네임 중복 확인 중 오류가 발생했습니다.' });
        }
    };

    return (
        <div className="container-xxl">
            <div className="authentication-wrapper authentication-basic container-p-y">
                <div className="authentication-inner">
                    <div className="card px-sm-6 px-0">
                        <div className="card-body">
                            <h4 className="mb-1">당신에 대해 더 알려주세요!</h4>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name-input" className="form-label">이름<span className="text-danger">*</span></label>
                                    <input
                                        id="name-input"
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        placeholder="이름"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && <p className="error">{errors.name}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="nick-name-input" className="form-label">닉네임<span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input
                                            id="nick-name-input"
                                            type="text"
                                            className="form-control"
                                            name="nickname"
                                            placeholder="닉네임"
                                            value={formData.nickname}
                                            onChange={handleChange}
                                        />
                                        <button type="button" className="btn btn-outline-primary" onClick={handleCheckNickname}>중복확인</button>
                                    </div>
                                    {errors.nickname && <p className="error">{errors.nickname}</p>}
                                    {errors.nickname_success && <p className="error">{errors.nickname_success}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="phone-number" className="form-label">전화번호<span className="text-danger">*</span></label>
                                    <input
                                        id="phone-number"
                                        type="text"
                                        className="form-control"
                                        name="phoneNumber"
                                        placeholder="010-1234-5678"
                                        maxLength="13"
                                        value={formData.phoneNumber}
                                        onChange={handleChangeNumber}
                                    />
                                    {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
                                </div>

                                <div className="row">
                                    <label>직업<span className="text-danger">*</span></label>
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
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">완료</button>
                                </div>
                                <br/>
                                {errors.default && <div className="alert alert-danger">{errors.default}</div>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
