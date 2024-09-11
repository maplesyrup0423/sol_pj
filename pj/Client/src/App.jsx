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
import EditAccount from "./components/pages/homeLayout/center/UserProfile/EditAccount";
import Room from "./components/pages/homeLayout/center/chat/Room";
import PrivateRoute from "./components/auth/privateRoute";
import FeedDetail from "./components/pages/homeLayout/center/feed/FeedDetail";
import FeedProfile from "./components/pages/homeLayout/center/UserProfile/FeedProfile";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PrivateRoute element={<HomePage />} />, // 수정됨
      children: [
        {
          path: "/",
          element: <PrivateRoute element={<FeedMain />} />, // 수정됨
        },
        {
          path: "/post/:boardId",
          element: <PrivateRoute element={<FeedMain />} />, // 수정됨
        },
        {
          path: "/post/:boardId/:postId",
          element: <PrivateRoute element={<FeedDetail />} />, // 추가됨
        },
        {
          path: "/myPage",
          element: <PrivateRoute element={<UserProfile />} />, // 수정됨
        },
        {
          path: "/editProfile",
          element: <PrivateRoute element={<MyProfile />} />, // 수정됨
        },
        {
          path: "/followers",
          element: <PrivateRoute element={<Followers />} />, // 수정됨
        },
        {
          path: "/account",
          element: <PrivateRoute element={<EditAccount />} />, // 수정됨
        },
        {
          path: "/chatRoom",
          element: <PrivateRoute element={<Room />} />, // 수정됨
        },
        {
          path: "/feedProfile",
          element: <PrivateRoute element={<FeedProfile />} />, // 수정됨
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
