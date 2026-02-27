import {lazy, Suspense} from "react";

const HistoryRoutes = () => {
    const Loading = <div>Loading....</div>

    const HistoryPage = lazy(() => import("../pages/history/HistoryPage"));
    const HistorySolve = lazy(() => import("../pages/history/HistorySolve"));

    return [
        {
            path: "",
            element: <Suspense fallback={Loading}><HistoryPage/></Suspense>
        },
        {
            path: ":setId/solve",
            element: <Suspense fallback={Loading}><HistorySolve/></Suspense>
        }
    ]
}

export default HistoryRoutes