import {lazy, Suspense} from "react";

const StudyGroupRoutes = () => {
    const Loading = <div>Loading....</div>

    const QuizPage = lazy(() => import("../pages/Quiz/QuizTable"));
    const QuizSolvePage = lazy(() => import("../pages/Quiz/QuizSolve"));


    return [
        {
            path: "",
            element: <Suspense fallback={Loading}><QuizPage/></Suspense>
        },
        {
            path: ":setId/solve",
            element: <Suspense fallback={Loading}><QuizSolvePage/></Suspense>
        }  
    ]
}

export default StudyGroupRoutes