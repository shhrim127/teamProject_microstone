import { Suspense, lazy } from "react";
import { BrowserRouter as Router } from 'react-router-dom';


import userRouter from "./userRouter";
import adminRouter from "./adminRouter";
import WorkBooksRoutes from "./WorkBooksRoutes";
import BoardRoutes from "./BoardRoutes";
import StudyGroupRoutes from "./StudyGroupRoutes";
import NotificationsRoutes from "./NotificationsRoutes";
import MyPageRoutes from "./MyPageRoutes";
import QuizRouters from "./QuizRouters";

//Page Import
import ErrorPage from '../pages/Error404';
import HistoryRoutes from "./HistoryRoutes";


const { createBrowserRouter } = require("react-router-dom");

const Loading = <div>Loading....</div>
const Main = lazy(() => import("../pages/main/MainPage"))
const FindPassword = lazy(() => import("../pages/findpwd"));
const ChangePassword = lazy(() => import("../pages/changepwd")); 
const FindID = lazy(() => import("../pages/FindID"));

const root = createBrowserRouter([
    {
        path: "",
        element: <Suspense fallback={Loading}><Main/></Suspense>
    },
    {
        path: "user",
        children: userRouter()
    },
    {
        path: "admin",
        children: adminRouter()
    },

    {
        path: "findpwd",
        element: <Suspense fallback={Loading}><FindPassword /></Suspense>
    },

    {
        // 0914 경로 꼬이면 절대 안됨
        path: "reset-password",
        element: <Suspense fallback={Loading}><ChangePassword/></Suspense>
    },

    {
        path: "find-id",
        element: <Suspense fallback={Loading}><FindID/></Suspense>
    },

    {
        path: "quiz",
        children: QuizRouters()
    },

    {
        path: "myworkbook",
        children: WorkBooksRoutes()
    },

    {
        path: "board",
        children: BoardRoutes()
    },

    {
        path: "group",
        children: StudyGroupRoutes()
    },

    {
        path: "notifications",
        children: NotificationsRoutes()
    },

    {
        path: "my-page",
        children: MyPageRoutes()
    },
    {
        path: "history",
        children: HistoryRoutes()
    },

    {
        path: "*",
        element: <Suspense fallback={Loading}><ErrorPage/></Suspense>
    }

    // <Router>
    //     <AuthRoutes />
    //     <DashboardRoutes />
    //     <BoardRoutes />
    //     <AdminRoutes />
    //     <CommonRoutes />
    // </Router>
])

export default root;