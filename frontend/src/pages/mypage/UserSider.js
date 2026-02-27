import React from "react";

const UserSidebar = ({
  id,
  username,
  email,
  group,
  department,
  role,
  phone_num,
  created_at,
  commitcount,
  writercount,
}) => {
  return (
    <div className="col-xl-4 col-lg-5 order-1 order-md-0">
      <div className="card mb-6">
        <div className="card-body">
          <small className="card-text text-uppercase text-muted small">계정</small>
          <ul className="list-unstyled my-3 py-1">
            <li className="d-flex align-items-center mb-4"><i className="bx bx-user"></i><span className="fw-medium mx-2">아이디:</span> <span>{id}</span></li>
            <li className="d-flex align-items-center mb-4"><i className="bx bx-flag"></i><span className="fw-medium mx-2">닉네임:</span> <span>{username}</span></li>
            <li className="d-flex align-items-center mb-2"><i className="bx bx-envelope"></i><span className="fw-medium mx-2">이메일:</span> <span>{email}</span></li>
          </ul>
          <small className="card-text text-uppercase text-muted small">세부정보</small>
          <ul className="list-unstyled my-3 py-1">
            <li className="d-flex align-items-center mb-4"><i className="bx bx-group"></i><span className="fw-medium mx-2">전공:</span> <span>{department}</span></li>
            <li className="d-flex align-items-center mb-4"><i className="bx bx-group"></i><span className="fw-medium mx-2">직업:</span> <span>{group}</span></li>
            <li className="d-flex align-items-center mb-4"><i className="bx bx-phone"></i><span className="fw-medium mx-2">전화번호:</span> <span>{phone_num}</span></li>
            <li className="d-flex align-items-center mb-4"><i className="bx bx-crown"></i><span className="fw-medium mx-2">Role:</span> <span>{role}</span></li>
          </ul>
          <small className="card-text text-uppercase text-muted small">기타</small>
          <ul className="list-unstyled mb-0 mt-3 pt-1">
            <li className="d-flex align-items-center mb-4"><i className="bx bx-calendar"></i><span className="fw-medium mx-2">생성일:</span> <span>{created_at}</span></li>
            <li className="d-flex align-items-center mb-4"><i className="bx bx-detail"></i><span className="fw-medium mx-2">댓글 작성 수:</span> <span>{commitcount}</span></li>
            <li className="d-flex align-items-center mb-4"><i className="bx bx-detail"></i><span className="fw-medium mx-2">글 작성 수:</span> <span>{writercount}</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
