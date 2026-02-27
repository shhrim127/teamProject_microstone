import {lazy, Suspense} from "react";

const MyPageRoutes = () => {
    const Loading = <div>Loading....</div>

    const MyPage = lazy(() => import("../pages/mypage/MyPage"));

    return [
        {
            // path: "page",
            // element: <Suspense fallback={Loading}><AdminPage/></Suspense>
        },
        {
            // 민지_마이페이지
            // path: ":user_id",
            path: "",
            element: <Suspense fallback={Loading}><MyPage/></Suspense>
        }
    ]
}

export default MyPageRoutes