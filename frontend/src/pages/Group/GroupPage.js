// import { Layout } from 'antd';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/sidebar';
// import GroupTable from './components/GroupTable';
// import Pagination from './components/Pagination';
// import GroupNavBar from './components/GroupNavBar';
// import SearchBar from './components/SearchBar';
// import CardLayout from './components/CardLayout';
// import './GroupPage.css';
// import { getUserGroups } from "../../api/StudyGroupApi"; // API 함수 임포트
//
// const { Header, Content } = Layout;
//
// const GroupPage = () => {
//     const navigate = useNavigate();
//     const [hoveredRow, setHoveredRow] = useState(null);
//     const [searchValue, setSearchValue] = useState(''); // 검색 입력 상태
//     const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
//     const itemsPerPage = 10; // 페이지당 항목 수
//
//     const [groups, setGroups] = useState([]); // 가져온 그룹들을 저장하는 상태
//     const [totalItems, setTotalItems] = useState(0); // 전체 그룹 수
//
//     useEffect(() => {
//         const fetchUserGroups = async () => {
//             try {
//                 // API를 통한 실제 데이터 가져오기 (임시 데이터를 사용할 것이므로 주석 처리)
//                 const loggedInUser = localStorage.getItem('user');
//                 if (loggedInUser) {
//                     const user = JSON.parse(loggedInUser);
//                     const userGroups = await getUserGroups(user.id);
//                     setGroups(userGroups || []); // 가져온 그룹 리스트를 상태에 저장
//                     setTotalItems(userGroups.length); // 총 그룹 수는 배열의 길이에서 유도됨
//                 }
//
//                 // 임시 데이터 사용
//                 // const mockData = [
//                 //     { group_id: '1', group_name: '프로젝트 A', admin_nickname: 'Alice', present_member_num: 5, max_member_num: 10 },
//                 //     { group_id: '2', group_name: '스터디 B', admin_nickname: 'Bob', present_member_num: 8, max_member_num: 15 },
//                 //     { group_id: '3', group_name: '동아리 C', admin_nickname: 'Charlie', present_member_num: 12, max_member_num: 20 },
//                 //     // 추가 데이터...
//                 // ];
//                 // setGroups(mockData);
//                 // setTotalItems(mockData.length);
//             } catch (error) {
//                 console.error('유저 그룹을 가져오는 중 오류 발생:', error);
//             }
//         };
//         fetchUserGroups();
//     }, []);
//
//     // 페이지네이션 처리
//     const paginatedData = groups && groups.length > 0
//         ? groups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
//         : [];
//
//     // 행을 클릭하면 그룹 콘텐츠 페이지로 이동
//     const goToContent = (groupId) => {
//         navigate(`/group/${groupId}/main`); // 그룹 ID에 따라 특정 그룹 콘텐츠 페이지로 이동
//     };
//
//     const handleSearch = () => {
//         // 검색 로직은 여기에 구현 가능
//         console.log('Search Value:', searchValue);
//     };
//
//     const handlePageChange = (page) => {
//         setCurrentPage(page); // 페이지네이션을 위한 현재 페이지 번호 업데이트
//     };
//
//     return (
//         <div className="layout-wrapper layout-content-navbar">
//             <div className="layout-container">
//                 <Sidebar current_page="group" />
//                 <div className="layout-page">
//                     <div className="dataTables_wrapper">
//                         <div className="container-xxl flex-grow-1 container-p-y">
//                             <CardLayout
//                                 headerContent={
//                                     <>
//                                         <GroupNavBar />
//                                         <SearchBar
//                                             searchValue={searchValue}
//                                             onSearchChange={setSearchValue}
//                                             onSearchClick={handleSearch}
//                                         />
//                                     </>
//                                 }
//                                 bodyContent={
//                                     <>
//                                         <GroupTable
//                                             paginatedData={paginatedData} // 페이지네이션된 그룹 데이터를 테이블에 전달
//                                             hoveredRow={hoveredRow}
//                                             handleMouseEnter={setHoveredRow}
//                                             handleMouseLeave={() => setHoveredRow(null)}
//                                             goToContent={goToContent} // 행 클릭 시 이동할 함수 전달
//                                         />
//                                         <div className="row" style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
//                                             <div className="col-sm-12 col-md-6" style={{ display: 'flex', justifyContent: 'center' }}>
//                                                 <Pagination
//                                                     currentPage={currentPage} // 현재 페이지 번호
//                                                     totalItems={totalItems} // 전체 항목 수
//                                                     itemsPerPage={itemsPerPage} // 페이지당 항목 수
//                                                     handlePageChange={handlePageChange} // 페이지 변경 처리 함수
//                                                 />
//                                             </div>
//                                         </div>
//                                     </>
//                                 }
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default GroupPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import GroupTable from './components/GroupTable';
import Pagination from './components/Pagination';
import GroupNavBar from './components/GroupNavBar';
import SearchBar from './components/SearchBar';
import CardLayout from './components/CardLayout';
import './GroupPage.css';
import { getUserGroups, getAllGroups } from "../../api/StudyGroupApi"; // API 함수 임포트

const GroupPage = () => {
    const navigate = useNavigate();
    const [hoveredRow, setHoveredRow] = useState(null);
    const [searchValue, setSearchValue] = useState(''); // 검색 입력 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const itemsPerPage = 10; // 페이지당 항목 수

    const [groups, setGroups] = useState([]); // 가져온 그룹들을 저장하는 상태
    const [totalItems, setTotalItems] = useState(0); // 전체 그룹 수

    useEffect(() => {
        const fetchUserGroups = async () => {
            try {
                const loggedInUser = localStorage.getItem('user');
                if (!loggedInUser) {
                    navigate('/user/login');
                    return;
                }
                const user = JSON.parse(loggedInUser);
                const userGroups = await getUserGroups(user.id);
                if (Array.isArray(userGroups)) {
                    setGroups(userGroups); // 가져온 그룹 리스트를 상태에 저장
                    setTotalItems(userGroups.length); // 총 그룹 수는 배열의 길이에서 유도됨
                } else {
                    setGroups([]);
                    setTotalItems(0);
                }
            } catch (error) {
                console.error('유저 그룹을 가져오는 중 오류 발생:', error);
                navigate('/user/login'); // 오류 발생 시 로그인 페이지로 리디렉션
            }
        };
        fetchUserGroups();
    }, [navigate]);

    // 페이지네이션 처리
    const paginatedData = groups.slice(
        (currentPage - 1) * itemsPerPage,
        Math.min(currentPage * itemsPerPage, totalItems)
    );

    const goToContent = (groupId) => {
        navigate(`/group/${groupId}/main`); // 그룹 ID에 따라 특정 그룹 콘텐츠 페이지로 이동
    };

    const handleSearch = () => {
        console.log('Search Value:', searchValue);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > Math.ceil(totalItems / itemsPerPage)) {
            return;
        }
        setCurrentPage(page); // 페이지네이션을 위한 현재 페이지 번호 업데이트
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
                                            paginatedData={paginatedData} // 페이지네이션된 그룹 데이터를 테이블에 전달
                                            hoveredRow={hoveredRow}
                                            handleMouseEnter={setHoveredRow}
                                            handleMouseLeave={() => setHoveredRow(null)}
                                            goToContent={goToContent} // 행 클릭 시 이동할 함수 전달
                                        />
                                        <div className="row" style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
                                            <div className="col-sm-12 col-md-6" style={{ display: 'flex', justifyContent: 'center' }}>
                                                <Pagination
                                                    currentPage={currentPage} // 현재 페이지 번호
                                                    totalItems={totalItems} // 전체 항목 수
                                                    itemsPerPage={itemsPerPage} // 페이지당 항목 수
                                                    handlePageChange={handlePageChange} // 페이지 변경 처리 함수
                                                />
                                            </div>
                                        </div>
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

export default GroupPage;
