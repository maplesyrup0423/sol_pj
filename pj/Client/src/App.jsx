import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import LoginPage from "./components/pages/Login";
// import IntroPage from "./components/pages/IntroLayout/Intro";
import HomePage from "./components/pages/homeLayout/Home";
import FeedMain from "./components/pages/homeLayout/center/feed/FeedMain";
import UserProfile from "./components/pages/homeLayout/center/UserProfile/UserProfile";
import MyProfile from "./components/pages/homeLayout/center/UserProfile/EditProfile";
import SignUp from "./components/pages/SignUp";
import Followers from "./components/pages/homeLayout/right/Followers";
import EditAccount from "./components/pages/homeLayout/center/UserProfile/EditAccount";
import Room from "./components/pages/homeLayout/center/chat/Room";
import ChatFriendList from "./components/pages/homeLayout/center/chat/ChatFriendList";
import FeedDetail from "./components/pages/homeLayout/center/feed/FeedDetail";
import BookmarkView from "./components/pages/homeLayout/center/feed/BookmarkView";
import MyNotifications from "./components/pages/homeLayout/center/notification/MyNotifications";
import PrivateRoute from "./components/auth/privateRoute";
import { NotificationProvider } from "./Context/NotificationContext";
import SearchPage from "./components/pages/homeLayout/center/feed/SearchPage";

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
                        </PrivateRoute>
                    ),
                },
                {
                    path: "/post/:boardId",
                    element: (
                        <PrivateRoute>
                            <FeedMain />
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
                            <EditAccount />
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
