import {lazy, Suspense} from "react";

const BoardRoutes = () => {
    const Loading = <div>Loading....</div>

    const BoardPage = lazy(() => import("../pages/Board/BoardPage"));
    const BoardNoticePage = lazy(() => import("../pages/Board/BoardNoticePage"));
    const FreePage = lazy(() => import("../pages/Board/FreePage"));
    const QuestionPage = lazy(() => import("../pages/Board/QuestionPage"));
    const ProblemSharePage = lazy(() => import("../pages/Board/ProblemSharePage"));
    const BoardWritePage = lazy(() => import("../pages/Board/BoardWritePage"));

    // 임시로 추가할 BoardDetailPage 컴포넌트
    const BoardDetailPage = lazy(() => import("../pages/Board/BoardDetailPage")); 

    return [
        {
            path: "all",
            element: <Suspense fallback={Loading}><BoardPage/></Suspense>
        },
        {
            path: "notice",
            element: <Suspense fallback={Loading}><BoardPage/></Suspense>
        },
        {
            path: "free",
            element: <Suspense fallback={Loading}><BoardPage/></Suspense>
        },
        {
            path: "question",
            element: <Suspense fallback={Loading}><BoardPage/></Suspense>
        },
        {
            path: "problem_sharing",
            element: <Suspense fallback={Loading}><BoardPage/></Suspense>
        },
        {
            path: "write",
            element: <Suspense fallback={Loading}><BoardWritePage/></Suspense>
        },
        
         // 임시 경로 추가
        {
            path: "detail/:id",
            element: <Suspense fallback={Loading}><BoardDetailPage /></Suspense>
        },
        {
            path: "write/:id",
            element: <Suspense fallback={Loading}><BoardWritePage /></Suspense>
        },

    ]
}

export default BoardRoutes