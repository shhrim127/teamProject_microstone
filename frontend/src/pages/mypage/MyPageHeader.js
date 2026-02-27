import React from 'react';

const UserProfile = ({ userName, userGroup, created_at }) => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="card mb-6">
          <div className="user-profile-header-banner">
            <img src="assets/img/page/profile-banner.png" alt="Banner image" className="rounded-top" />
          </div>
          <div className="user-profile-header d-flex flex-column flex-lg-row text-sm-start text-center mb-8">
            <div className="flex-grow-1 mt-3 mt-lg-5">
              <div className="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-5 flex-md-row flex-column gap-4">
                <div className="user-profile-info">
                  <h4 className="mb-2 mt-lg-7">{userName}</h4>
                  <ul className="list-inline mb-0 d-flex align-items-center flex-wrap justify-content-sm-start justify-content-center gap-4 mt-4">
                    <li className="list-inline-item">
                      <i className="bx bx-group me-2 align-top"></i>
                      <span className="fw-medium">{userGroup}</span>
                    </li>
                    <li className="list-inline-item">
                      <i className="bx bx-calendar me-2 align-top"></i>
                      <span className="fw-medium">생성일 {created_at}</span>
                    </li>
                  </ul>
                </div>
                {/* <a href="javascript:void(0)" className="btn btn-primary mb-1">
                  <i className="bx bx-user-check bx-sm me-2"></i>Connected
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
