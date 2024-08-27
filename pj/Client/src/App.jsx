import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import LoginPage, { action as loginAction } from "./components/pages/Login";
import IntroPage from "./components/pages/IntroLayout/Intro";
import HomePage from "./components/pages/homeLayout/Home";
import FeedMain from "./components/pages/homeLayout/center/feed/FeedMain";
import UserProfile from "./components/pages/homeLayout/center/UserProfile/UserProfile";
import { useState, useEffect } from "react";

function App() {
  // !로그인 회원 정보는 나중에 토큰으로 변경 예정
  //! 지금까지 제작한 컴포넌트들의 값을 위해 최상단에 임시 하드코딩함
  const [myInfo, setMyInfo] = useState([]);
  useEffect(() => {
    const myInfoCallApi = async () => {
      try {
        const response = await fetch("/api/userProfileInfo");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMyInfo(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setMyInfo([]); // 오류가 발생할 경우 빈 배열로 설정
      }
    };

    myInfoCallApi();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage myInfo={myInfo} />,
      children: [
        {
          path: "/",
          element: <FeedMain myInfo={myInfo} />, //처음에 보일 화면 아직 처리 안함
        },
        {
          path: "/post/:boardId",
          element: <FeedMain myInfo={myInfo} />, // 게시판 ID에 따라 데이터를 처리할 페이지
        },
        {
          path: "/myPage",
          element: <UserProfile myInfo={myInfo} />, // 마이페이지
        },
      ],
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
