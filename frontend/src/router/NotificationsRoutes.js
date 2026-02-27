import {lazy, Suspense} from "react";

const NotificationsRoutes = () => {
    const Loading = <div>Loading....</div>

    const NotAdminPage = lazy(() => import("../pages/admin/NotAdminPage"));

    return [
        {
            // path: "page",
            // element: <Suspense fallback={Loading}><AdminPage/></Suspense>
        },
    ]
}

export default NotificationsRoutes