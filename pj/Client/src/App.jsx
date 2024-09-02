// src/App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import "./App.css";
import LoginPage from "./components/pages/Login";
import IntroPage from "./components/pages/IntroLayout/Intro";
import HomePage from "./components/pages/homeLayout/Home";
// import FeedMain from "./components/pages/homeLayout/center/feed/FeedMain";
// import UserProfile from "./components/pages/homeLayout/center/UserProfile/UserProfile";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      // children: [
      //   // {
      //   //   path: "/",
      //   //   element: <FeedMain />,
      //   // },
      //   // {
      //   //   path: "/post/:boardId",
      //   //   element: <FeedMain />,
      //   // },
      //   // {
      //   //   path: "/myPage",
      //   //   element: <UserProfile />,
      //   // },
      // ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/intro",
      element: <IntroPage />,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
