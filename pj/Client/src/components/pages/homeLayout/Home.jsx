import "./Home.css";
import LeftNav from "./left/LeftNav";
import RightNav from "./right/RightNav";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";

function HomePage() {
  const { userInfo } = useContext(AuthContext);
  //사용 <div>{`${userInfo.user_no}은 있다.`}</div>
  // 콘솔 로그로 userInfo 확인
  console.log("UserInfo:", userInfo);
  return (
    <div className="container">
      <div className="leftNav">
        {userInfo ? (
          <>
            <LeftNav userInfo={userInfo} />
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      <div className="center">
        <Outlet />
      </div>

      <div className="rightNav">
        <RightNav />
      </div>
    </div>
  );
}

export default HomePage;
