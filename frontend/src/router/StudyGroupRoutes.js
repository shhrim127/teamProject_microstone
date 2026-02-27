import {lazy, Suspense} from "react";

const StudyGroupRoutes = () => {
    const Loading = <div>Loading....</div>

    const GroupPage = lazy(() => import("../pages/Group/GroupPage"));
    const AllGroupPage = lazy(() => import("../pages/Group/AllGroupPage"));
    const CreateGroupPage = lazy(() => import("../pages/Group/CreateGroupPage"));
    const GroupDetailPage = lazy(() => import("../pages/Group/GroupDetailPage"));

    return [
        {
            path: "my-group",
            element: <Suspense fallback={Loading}><GroupPage/></Suspense>
        },
        {
            path: "all",
            element: <Suspense fallback={Loading}><AllGroupPage/></Suspense>
        },
        {
            path: "create",
            element: <Suspense fallback={Loading}><CreateGroupPage/></Suspense>
        },
        {
            path: ":groupId/main", // (내가 속한 그룹인 경우)메인
            element: <Suspense fallback={Loading}><GroupDetailPage/></Suspense>
        },
        {
            path: ":groupId/board", // (내가 속한 그룹인 경우)게시판
            element: <Suspense fallback={Loading}><GroupDetailPage/></Suspense>
        },
        {
            path: ":groupId/member", // (내가 속한 그룹인 경우)멤버
            element: <Suspense fallback={Loading}><GroupDetailPage/></Suspense>
        },
        {
            path: ":groupId/chat", // (내가 속한 그룹인 경우)채팅
            element: <Suspense fallback={Loading}><GroupDetailPage/></Suspense>
        },
        {
            path: ":groupId/management", // (내가 속한 그룹인 경우) 관리
            element: <Suspense fallback={Loading}><GroupDetailPage/></Suspense>
        },
        {
            path: ":groupId/myinfo", // (내가 속한 그룹인 경우)내 정보
            element: <Suspense fallback={Loading}><GroupDetailPage/></Suspense>
        },
    ]
}

export default StudyGroupRoutes;
