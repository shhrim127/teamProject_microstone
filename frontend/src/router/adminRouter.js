import {lazy, Suspense} from "react";
import { Route, Routes } from 'react-router-dom';

// import AdminDashboard from '../src/pages/admin/AdminDashboard';
// import UserManagement from '../src/pages/admin/UserManagement';
// import ReportManagement from '../src/pages/admin/ReportManagement';
// import ContentManagement from '../src/pages/admin/ContentManagement';
// import CommentManagement from '../src/pages/admin/CommentManagement';
// import ProfileManagement from '../src/pages/admin/ProfileManagement';

const adminRouter = () => {
    const Loading = <div>Loading....</div>

    const NotAdminPage = lazy(() => import("../pages/admin/NotAdminPage"));
    const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
    return [
        {
            path: "page",
            element: <Suspense fallback={Loading}><NotAdminPage/></Suspense>
        },
        {
          path: "dashboard", // /admin/dashboard 경로
          element: <Suspense fallback={Loading}><AdminDashboard /></Suspense>
        }

        // <Routes>
        //     <Route path="/admin" component={AdminDashboard} />
        //     <Route path="/admin/users" component={UserManagement} />
        //     <Route path="/admin/reports" component={ReportManagement} />
        //     <Route path="/admin/content" component={ContentManagement} />
        //     <Route path="/admin/comments" component={CommentManagement} />
        //     <Route path="/admin/profile" component={ProfileManagement} />
        // </Routes>
    ]
}

export default adminRouter



