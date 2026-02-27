import { Suspense, lazy } from "react"

const userRouter = () => {
    const Loading = <div>Loading......</div>
    const Login = lazy(() => import("../pages/user/Login/LoginPage"));
    const FindPwd = lazy(() => import("../pages/findpwd"));
    const Generate = lazy(() => import("../pages/user/Login/register/generateAccountPage"));
    const Register = lazy(() => import("../pages/user/Login/register/registerPage"));


    const KakaoRedirect = lazy(() => import("../pages/user/Login/KakaoRedirectPage"));
    const GoogleRedirect = lazy(() => import("../pages/user/Login/GoogleRedirectPage"));


    return [
        {
            path: "login",
            element: <Suspense fallback={Loading}><Login/></Suspense>
        },
        {
            path: "findpwd",
            element: <Suspense fallback={Loading}><FindPwd/></Suspense>
        },
        {
            path: "kakao",
            element: <Suspense fallback={Loading}><KakaoRedirect/></Suspense>
        },
        {
            path: "google",
            element: <Suspense fallback={Loading}><GoogleRedirect/></Suspense>
        },
        {   path: "register",
            element: <Suspense fallback={Loading}><Register/></Suspense>
        },
        {
            path: "generate",
            element: <Suspense fallback={Loading}><Generate/></Suspense>
        }
    ]
}

export default userRouter