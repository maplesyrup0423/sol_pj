import "./LeftNav.css";
import BoardInfo from "./BoardInfo";
import ProfileCard from "./ProfileCard";

function LeftNav({ myInfo }) {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <div className="logoCon">
            <button className="logoButton">
              <img
                className="logo"
                src="/web-development.png"
                alt="로고 이미지"
              />
              {/* 로고를 누르면 새로고침 */}
            </button>
          </div>
        </li>
        <li>
          <BoardInfo />
        </li>

        <li>
          <a href="#profileCard">
            {myInfo.length > 0 ? (
              <ProfileCard
                user_no={myInfo[0].user_no}
                nickname={myInfo[0].nickname}
                image_url={myInfo[0].image_url}
                user_id={myInfo[0].user_id}
              />
            ) : (
              <h5>로그인 해주세욤</h5>
            )}
          </a>
        </li>
      </ul>
    </div>
  );
}

export default LeftNav;
