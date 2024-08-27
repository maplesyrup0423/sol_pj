import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import LoginPage, { action as loginAction } from "./components/pages/Login";
import IntroPage from "./components/pages/IntroLayout/Intro";
import HomePage from "./components/pages/homeLayout/Home";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <HomePage />,
        },
        {
            path: "/login",
            element: <LoginPage />,
            action: loginAction,
        },
        {
            path: "/intro",
            element: <IntroPage />,
        },
    ]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
