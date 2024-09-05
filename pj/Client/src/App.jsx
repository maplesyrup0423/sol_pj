// src/App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import LoginPage from "./components/pages/Login";
import IntroPage from "./components/pages/IntroLayout/Intro";
import HomePage from "./components/pages/homeLayout/Home";
import FeedMain from "./components/pages/homeLayout/center/feed/FeedMain";
import UserProfile from "./components/pages/homeLayout/center/UserProfile/UserProfile";
import MyProfile from "./components/pages/homeLayout/center/UserProfile/EditProfile";
import SignUp from "./components/pages/SignUp";
import Followers from "./components/pages/homeLayout/right/Followers";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",

            element: <HomePage />,
            children: [
                {
                    path: "/",
                    element: <FeedMain />, //처음에 보일 화면 아직 처리 안함
                },
                {
                    path: "/post/:boardId",
                    element: <FeedMain />, // 게시판 ID에 따라 데이터를 처리할 페이지
                },
                {
                    path: "/myPage",
                    element: <UserProfile />, // 마이페이지
                },
                {
                    path: "/editProfile",
                    element: <MyProfile />, // 프로필수정
                },
                {
                    path: "/followers",
                    element: <Followers />,
                },
            ],
        },
        {
            path: "/login",
            element: <LoginPage />,
        },
        {
            path: "/intro",
            element: <IntroPage />,
        },
        {
            path: "/signup",
            element: <SignUp />,
        },
    ]);

    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
