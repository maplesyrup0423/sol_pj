import "./Home.css";
import LeftNav from "./left/LeftNav";
import RightNav from "./right/RightNav";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";

function HomePage() {
  const { userInfo } = useContext(AuthContext);
  return (
    <div className="homeContainer">
      <div className="leftNav">
        <LeftNav userInfo={userInfo} />
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
