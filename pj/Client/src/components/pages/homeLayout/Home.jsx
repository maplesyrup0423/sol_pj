import "./Home.css";
import LeftNav from "./left/LeftNav.jsx";
import RightNav from "./right/RightNav.jsx";
import { Outlet } from "react-router-dom";

function HomePage({ myInfo }) {
  return (
    <div className="container">
      <div className="leftNav">
        {myInfo.length > 0 && <LeftNav myInfo={myInfo} />}
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
