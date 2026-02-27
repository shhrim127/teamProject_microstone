import React, {useState} from "react";
import {checkUserNickname} from "../../api/memberApi";
import Swal from 'sweetalert2';
import {BASE_URL} from "../../api/config";

const AccountSettingsForm = ({
  id,
  username,
  email,
  group,
  role,
  phone_num,
  created_at,
  department,
  onChange, // 상위 컴포넌트에서 폼 제출 처리를 위한 핸들러
}) => {

    const [initialUsername] = useState(username);
    const [errors, setErrors] = useState({});
    const [isNicknameChecked, setIsNicknameChecked] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(""); // 전화번호 에러 상태 추가

    // Handle input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      onChange(name, value);

      if (name === "nickname" && value !== initialUsername) {
        setIsNicknameChecked(false); // 닉네임 변경 시 중복 확인 상태 초기화
      }

      if (name === "phone_num") {
        handlePhoneNumberChange(value); // 전화번호 유효성 검사 호출
      }
    };

    // 전화번호 유효성 검사 함수
    const handlePhoneNumberChange = (value) => {
      let formattedValue = value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거

      if (formattedValue.length >= 4 && formattedValue.length < 8) {
        formattedValue = formattedValue.slice(0, 3) + '-' + formattedValue.slice(3);
      } else if (formattedValue.length >= 8) {
        formattedValue = formattedValue.slice(0, 3) + '-' + formattedValue.slice(3, 7) + '-' + formattedValue.slice(7, 11);
      }

      // 전화번호가 올바른 형식일 경우 추가 입력을 막음
      if (formattedValue.length === 13) {
        setPhoneNumberError(""); // 에러 메시지를 지우고 추가 입력을 막음
        onChange("phone_num", formattedValue); // 값 반영
        return; // 더 이상 입력 불가
      }

      if (value !== formattedValue) {
        setPhoneNumberError("숫자 이외의 문자는 입력할 수 없습니다.");
      } else if (formattedValue.length !== 13) { // 010-0000-0000 형식이 아닐 때만 에러 메시지 출력
        setPhoneNumberError("전화번호 양식을 맞춰주세요.");
      }

      onChange("phone_num", formattedValue);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const handleCheckNickname = async () => {
        if (!username) {
            setErrors({ ...errors, username: '닉네임을 입력해주세요.' });
            return;
        }

        try {
            const isDuplicate = await checkUserNickname(username);
            if (isDuplicate) {
                setErrors({ ...errors, username: '이미 사용 중인 닉네임입니다.', username_success: '' });
            } else {
                setErrors({ ...errors, username: '', username_success: '사용 가능한 닉네임입니다.' });
                setIsNicknameChecked(true);  // 중복 확인 완료 상태
            }
        } catch (error) {
            setErrors({ ...errors, nickname: '닉네임 중복 확인 중 오류가 발생했습니다.' });
        }
    };

    const handleSubmitCancel = () => {
        window.location.reload()
    }

    const handleFormSubmit = async () => {
        try {
            if (!isNicknameChecked) {
                setErrors({ ...errors, username: '닉네임 중복 확인을 완료해주세요.', username_success: '' });
                return;
            }
            const response = await fetch(`${BASE_URL}/api/user/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: id,
                    nickname: username,
                    phone_num: phone_num,
                    occupation: group,
                    department: department,
                }),
            });

            if (!response.ok) {
                throw new Error('정보 업데이트 실패');
            }

            const result = await response.json();
            console.log('사용자 정보가 성공적으로 업데이트되었습니다.', result);

            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                storedUser.nickname = username;
                localStorage.setItem('user', JSON.stringify(storedUser));
            }

            const is_true = await Swal.fire({
                title: '성공!',
                text: '계정 정보가 수정이 완료되었습니다!',
                icon: 'success',
                customClass: {
                    confirmButton: 'btn btn-primary'
                },
                buttonsStyling: false,
                confirmButtonText:"확인"
            })
            if(is_true.isConfirmed){
                window.location.reload()
            }

        } catch (error) {
            console.error('정보 수정 중 오류 발생:', error);
        }
    };

    return (
      <div className="card-body">
        <form id="formAccountSettings" method="GET" onSubmit={handleSubmit}>
          <div className="row g-6">
            <div className="col-md-6">
              <label htmlFor="id" className="form-label">아이디</label>
              <input
                className="form-control"
                type="text"
                id="id"
                name="id"
                value={id}
                autoFocus
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="nickname" className="form-label">닉네임</label>
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={username}
                  onChange={handleChange}
                  readOnly={!isEditMode}
                />
                {isEditMode && (
                  <>
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      id="check-nickname-btn"
                      onClick={handleCheckNickname}>
                      중복확인
                    </button>
                  </>
                )}
              </div>
              {errors.username && <p className="error">{errors.username}</p>}
              {errors.username_success && <p className="error">{errors.username_success}</p>}
              {errors.default && <p className="error">{errors.default}</p>}
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">이메일</label>
              <input
                className="form-control"
                type="text"
                id="email"
                name="email"
                value={email}
                placeholder="example@example.com"
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="phoneNumber">전화번호</label>
              <div className="input-group input-group-merge">
                <input
                  type="text"
                  id="phoneNumber"
                  name="phone_num"
                  className={`form-control ${phoneNumberError ? 'is-invalid' : ''}`} // 에러 시 빨간 외곽선
                  value={phone_num}
                  onChange={handleChange}
                  readOnly={!isEditMode}
                />
                {/* 더 이상 경고 메시지를 표시하지 않고 포커스 시 빨간색 외곽선 */}
              </div>
              {phoneNumberError && <p className="error text-danger">{phoneNumberError}</p>}
            </div>
            <div className="col-md-6">
              <label htmlFor="create_date" className="form-label">생성일</label>
              <input
                className="form-control"
                type="text"
                id="create_date"
                name="create_date"
                value={created_at}
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="department" className="form-label">전공</label>
              <select
                className="form-select"
                id="inputGroupSelectDepartment"
                name="department"
                value={department}
                onChange={handleChange}
                aria-label="전공 선택"
                disabled={!isEditMode}
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
                {/* other options */}
              </select>
            </div>
            <div className="row" style={{marginTop: 24}}>
              <label htmlFor="group" className="form-label">직업</label>
              <div className="col-md-4">
                <div className={`form-check custom-option custom-option-icon ${group === 'STUDENT' ? 'checked' : ''}`}>
                  <label className="form-check-label custom-option-content" htmlFor="occupationStudent">
                    <span className="custom-option-body">
                      <i className="bx bx-edit-alt"></i>
                      <span className="custom-option-title"> 학생 </span>
                    </span>
                    <input
                      name="occupation"
                      className="form-check-input"
                      type="radio"
                      value="STUDENT"
                      id="occupationStudent"
                      checked={group === 'STUDENT'}
                      onChange={handleChange}
                      disabled={!isEditMode}
                    />
                  </label>
                </div>
              </div>
              <div className="col-md-4">
                <div className={`form-check custom-option custom-option-icon ${group === 'EDUCATOR' ? 'checked' : ''}`}>
                  <label className="form-check-label custom-option-content" htmlFor="occupationEducator">
                    <span className="custom-option-body">
                      <i className="bx bx-book-alt"></i>
                      <span className="custom-option-title"> 교육자 </span>
                    </span>
                    <input
                      name="occupation"
                      className="form-check-input"
                      type="radio"
                      value="EDUCATOR"
                      id="occupationEducator"
                      checked={group === 'EDUCATOR'}
                      onChange={handleChange}
                      disabled={!isEditMode}
                    />
                  </label>
                </div>
              </div>
              <div className="col-md-4">
                <div className={`form-check custom-option custom-option-icon ${group === 'NONE' ? 'checked' : ''}`}>
                  <label className="form-check-label custom-option-content" htmlFor="occupationNone">
                    <span className="custom-option-body">
                      <i className="bx bx-no-entry"></i>
                      <span className="custom-option-title"> 해당 없음 </span>
                    </span>
                    <input
                      name="occupation"
                      className="form-check-input"
                      type="radio"
                      value="NONE"
                      id="occupationNone"
                      checked={group === 'NONE'}
                      onChange={handleChange}
                      disabled={!isEditMode}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            {!isEditMode ? (
              <button onClick={() => setIsEditMode(true)} className="btn btn-primary me-3">
                정보 수정하기
              </button>
            ) : (
              <>
                <button type="submit" className="btn btn-primary me-3" onClick={handleFormSubmit}>
                  완료
                </button>
                <button type="submit" className="btn btn-label-secondary" onClick={handleSubmitCancel}>
                  취소
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    );
};

export default AccountSettingsForm;
