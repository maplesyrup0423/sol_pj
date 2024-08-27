import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import LoginPage, { action as loginAction } from "./components/pages/Login";
import IntroPage from "./components/pages/IntroLayout/Intro";
import HomePage from "./components/pages/homeLayout/Home";
import BoardPage from "./components/pages/homeLayout/center/feed/BoardPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      children: [],
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
    {
      path: "/post/:boardId",
      element: <BoardPage />, // 게시판 ID에 따라 데이터를 처리할 페이지
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
