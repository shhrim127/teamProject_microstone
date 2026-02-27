// import React, { useEffect, useState } from 'react';
// import { Layout } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/sidebar';
// import GroupTable from './components/GroupTable';
// import Pagination from './components/Pagination';
// import GroupNavBar from './components/GroupNavBar';
// import SearchBar from './components/SearchBar';
// import CardLayout from './components/CardLayout';
// import './GroupPage.css';
// import { getAllGroups } from "../../api/StudyGroupApi";
//
// const { Header, Content } = Layout;
//
// const AllGroupsPage = () => {
//   const navigate = useNavigate();
//   const [hoveredRow, setHoveredRow] = useState(null);
//   const [searchValue, setSearchValue] = useState(''); // 검색어 상태
//   const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
//   const itemsPerPage = 10; // 페이지당 항목 수
//   const [groups, setGroups] = useState([]); // 그룹 데이터를 저장하는 상태
//   const [totalItems, setTotalItems] = useState(0); // 총 항목 수 상태
//
//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         const allGroups = await getAllGroups();
//         setGroups(allGroups);
//         setTotalItems(allGroups.length);
//       } catch (error) {
//         console.error('그룹 데이터를 가져오는 중 오류 발생:', error);
//         // 에러 발생 시 로그인 페이지로 이동
//         window.location.href = '/user/login';
//       }
//     };
//     fetchGroups();
//   }, []);
//
//   // 검색어 필터링 적용
//   const filteredGroups = groups.filter(group =>
//       group.group_name.toLowerCase().includes(searchValue.toLowerCase())
//   );
//
//   // 유효한 페이지 수 계산
//   const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
//
//   // 현재 페이지에 해당하는 데이터 계산
//   const paginatedData = filteredGroups.slice(
//       (currentPage - 1) * itemsPerPage,
//       currentPage * itemsPerPage
//   );
//
//   // 페이지 번호가 범위를 벗어날 때 처리
//   useEffect(() => {
//     if (currentPage > totalPages) {
//       setCurrentPage(1); // 범위를 벗어나면 첫 페이지로 설정
//     }
//   }, [filteredGroups, currentPage, totalPages]);
//
//   // 그룹 상세 페이지로 이동하는 함수
//   const goToContent = (groupId) => {
//     navigate(`/group/${groupId}/main`);
//   };
//
//   // 검색어 입력 시 호출되는 함수
//   const handleSearch = () => {
//     console.log('검색어:', searchValue);
//   };
//
//   // 페이지 변경 시 호출되는 함수
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };
//
//   return (
//       <div className="layout-wrapper layout-content-navbar">
//         <div className="layout-container">
//           <Sidebar current_page="group" />
//           <div className="layout-page">
//             <div className="dataTables_wrapper">
//               <div className="container-xxl flex-grow-1 container-p-y">
//                 <CardLayout
//                     headerContent={
//                       <>
//                         <GroupNavBar />
//                         <SearchBar
//                             searchValue={searchValue}
//                             onSearchChange={setSearchValue}
//                             onSearchClick={handleSearch}
//                         />
//                       </>
//                     }
//                     bodyContent={
//                       <>
//                         <GroupTable
//                             paginatedData={paginatedData}
//                             hoveredRow={hoveredRow}
//                             handleMouseEnter={setHoveredRow}
//                             handleMouseLeave={() => setHoveredRow(null)}
//                             goToContent={goToContent}
//                         />
//                         {totalItems > 0 && (
//                             <div className="row" style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
//                               <div className="col-sm-12 col-md-6" style={{ display: 'flex', justifyContent: 'center' }}>
//                                 <Pagination
//                                     currentPage={currentPage}
//                                     totalItems={totalItems}
//                                     itemsPerPage={itemsPerPage}
//                                     handlePageChange={handlePageChange}
//                                 />
//                               </div>
//                             </div>
//                         )}
//                       </>
//                     }
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//   );
// };
//
// export default AllGroupsPage;

import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import GroupTable from './components/GroupTable';
import Pagination from './components/Pagination';
import GroupNavBar from './components/GroupNavBar';
import SearchBar from './components/SearchBar';
import CardLayout from './components/CardLayout';
import './GroupPage.css';
import { getAllGroups } from "../../api/StudyGroupApi";

const { Header, Content } = Layout;

const AllGroupsPage = () => {
  const navigate = useNavigate();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchValue, setSearchValue] = useState(''); // 검색어 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 10; // 페이지당 항목 수
  const [groups, setGroups] = useState([]); // 그룹 데이터를 저장하는 상태
  const [totalItems, setTotalItems] = useState(0); // 총 항목 수 상태

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const allGroups = await getAllGroups();
        // API 응답이 배열인지 확인하고, 그렇지 않으면 빈 배열로 설정
        if (Array.isArray(allGroups)) {
          setGroups(allGroups);
          setTotalItems(allGroups.length);
        } else {
          setGroups([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error('그룹 데이터를 가져오는 중 오류 발생:', error);
        // 에러 발생 시 로그인 페이지로 이동
        window.location.href = '/user/login';
      }
    };
    fetchGroups();
  }, []);

  // 검색어 필터링 적용
  const filteredGroups = Array.isArray(groups)
      ? groups.filter(group =>
          group.group_name?.toLowerCase().includes(searchValue.toLowerCase())
      )
      : [];

  // 유효한 페이지 수 계산
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);

  // 현재 페이지에 해당하는 데이터 계산
  const paginatedData = filteredGroups.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  // 페이지 번호가 범위를 벗어날 때 처리
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1); // 범위를 벗어나면 첫 페이지로 설정
    }
  }, [filteredGroups, currentPage, totalPages]);

  // 그룹 상세 페이지로 이동하는 함수
  const goToContent = (groupId) => {
    navigate(`/group/${groupId}/main`);
  };

  // 검색어 입력 시 호출되는 함수
  const handleSearch = () => {
    console.log('검색어:', searchValue);
  };

  // 페이지 변경 시 호출되는 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Sidebar current_page="group" />
          <div className="layout-page">
            <div className="dataTables_wrapper">
              <div className="container-xxl flex-grow-1 container-p-y">
                <CardLayout
                    headerContent={
                      <>
                        <GroupNavBar />
                        <SearchBar
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                            onSearchClick={handleSearch}
                        />
                      </>
                    }
                    bodyContent={
                      <>
                        <GroupTable
                            paginatedData={paginatedData}
                            hoveredRow={hoveredRow}
                            handleMouseEnter={setHoveredRow}
                            handleMouseLeave={() => setHoveredRow(null)}
                            goToContent={goToContent}
                        />
                        {totalItems > 0 && totalPages > 0 && (
                            <div className="row" style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
                              <div className="col-sm-12 col-md-6" style={{ display: 'flex', justifyContent: 'center' }}>
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={totalItems}
                                    itemsPerPage={itemsPerPage}
                                    handlePageChange={handlePageChange}
                                />
                              </div>
                            </div>
                        )}
                      </>
                    }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AllGroupsPage;
