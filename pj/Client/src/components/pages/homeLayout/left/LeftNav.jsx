import "./LeftNav.css";
import BoardInfo from "./BoardInfo";
import ProfileCard from "./ProfileCard";
import { Link } from "react-router-dom";

function LeftNav({ userInfo }) {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <div className="logoCon">
            <button className="logoButton">
              <Link to={"/"} className="no-hover">
                <img
                  className="logo"
                  src="/web-development.png"
                  alt="로고 이미지"
                />
              </Link>
            </button>
          </div>
        </li>
        <li>
          <BoardInfo />
        </li>

        <li id="ProfileCard_li">
          <Link to={"/myPage"}>
            {userInfo ? (
              <ProfileCard
                user_no={userInfo.user_no}
                nickname={userInfo.nickname}
                image_url={userInfo.image_url}
                user_id={userInfo.user_id}
              />
            ) : (
              <h5>로그인 해주세욤</h5>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default LeftNav;
