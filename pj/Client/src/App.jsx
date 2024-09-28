import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import LoginPage from "./components/pages/Login";
// import IntroPage from "./components/pages/IntroLayout/Intro";
import HomePage from "./components/pages/homeLayout/Home";
import FeedMain from "./components/pages/homeLayout/center/feed/FeedMain";
import UserProfile from "./components/pages/homeLayout/center/UserProfile/UserProfile";
//import MyProfile from "./components/pages/homeLayout/center/UserProfile/EditProfile";
import SignUp from "./components/pages/SignUp";
import Followers from "./components/pages/homeLayout/right/Followers";
//import EditAccount from "./components/pages/homeLayout/center/UserProfile/EditAccount";
import Room from "./components/pages/homeLayout/center/chat/Room";
import ChatFriendList from "./components/pages/homeLayout/center/chat/ChatFriendList";
import FeedDetail from "./components/pages/homeLayout/center/feed/FeedDetail";
import BookmarkView from "./components/pages/homeLayout/center/feed/BookmarkView";
import MyNotifications from "./components/pages/homeLayout/center/notification/MyNotifications";
import PrivateRoute from "./components/auth/privateRoute";
import { NotificationProvider } from "./Context/NotificationContext";
import SearchPage from "./components/pages/homeLayout/center/feed/SearchPage";
import Account from "./components/pages/homeLayout/center/UserProfile/Account/Account";
import ChangePassword from "./components/pages/homeLayout/center/UserProfile/Account/ChangePassword";
import LoginHistory from "./components/pages/homeLayout/center/UserProfile/Account/LoginHistory";
import TermsOfService from "./components/pages/homeLayout/center/Policy/TermsOfService";
import CookiePolicy from "./components/pages/homeLayout/center/Policy/CookiePolicy";
import PrivacyPolicy from "./components/pages/homeLayout/center/Policy/PrivacyPolicy";
import DeveloperInfo from "./components/pages/homeLayout/center/Policy/DeveloperInfo";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <PrivateRoute>
          <HomePage />
        </PrivateRoute>
      ),
      children: [
        {
          path: "/",
          element: (
            <PrivateRoute>
              <FeedMain />
              {/*로그인 시 처음 보일 피드메인 */}
            </PrivateRoute>
          ),
        },
        {
          path: "/post/:boardId",
          element: (
            <PrivateRoute>
              <FeedMain />
              {/*각 게시판 선택 시 보일 피드메인 */}
            </PrivateRoute>
          ),
        },
        {
          path: "/:username",
          element: (
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          ),
        },
        // {
        //   path: "/editProfile",
        //   element: (
        //     <PrivateRoute>
        //       <MyProfile />
        //     </PrivateRoute>
        //   ),
        // },
        {
          path: "/followers",
          element: (
            <PrivateRoute>
              <Followers />
            </PrivateRoute>
          ),
        },
        {
          path: "/account",
          element: (
            <PrivateRoute>
              <Account />
              {/* 계정설정 */}
            </PrivateRoute>
          ),
        },
        {
          path: "/ChangePassword",
          element: (
            <PrivateRoute>
              <ChangePassword />
              {/* 비밀번호 변경 */}
            </PrivateRoute>
          ),
        },
        {
          path: "/LoginHistory",
          element: (
            <PrivateRoute>
              <LoginHistory />
              {/* 로그인 기록 */}
            </PrivateRoute>
          ),
        },
        {
          path: "/room/:roomId",
          element: (
            <PrivateRoute>
              <Room />
            </PrivateRoute>
          ),
        },
        {
          path: "/chatFriendList",
          element: (
            <PrivateRoute>
              <ChatFriendList />
            </PrivateRoute>
          ),
        },
        {
          path: "/Bookmark",
          element: (
            <PrivateRoute>
              <BookmarkView />
              {/* 북마크 */}
            </PrivateRoute>
          ),
        },
        {
          path: "/myNotifications",
          element: (
            <PrivateRoute>
              <MyNotifications />
            </PrivateRoute>
          ),
        },
        {
          path: "/post/:boardId/:postId",
          element: (
            <PrivateRoute>
              <FeedDetail />
              {/* 피드 상세페이지 */}
            </PrivateRoute>
          ),
        },
        {
          path: "/search/:searchKeyword",
          element: (
            <PrivateRoute>
              <SearchPage />
            </PrivateRoute>
          ),
        },
        {
          path: "/Policy/TermsOfService",
          element: (
            <PrivateRoute>
              <TermsOfService />
              {/* 이용약관 */}
            </PrivateRoute>
          ),
        },
        {
          path: "/Policy/CookiePolicy",
          element: (
            <PrivateRoute>
              <CookiePolicy />
              {/* 쿠키정책 */}
            </PrivateRoute>
          ),
        },
        {
          path: "/Policy/PrivacyPolicy",
          element: (
            <PrivateRoute>
              <PrivacyPolicy />
              {/* 개인정보 처리방침 */}
            </PrivateRoute>
          ),
        },
        {
          path: "/DeveloperInfo",
          element: (
            <PrivateRoute>
              <DeveloperInfo />
              {/* 개발자 정보 */}
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    // {
    //     path: "/intro",
    //     element: <IntroPage />,
    // },
    {
      path: "/signup",
      element: <SignUp />,
    },
  ]);

  return (
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
