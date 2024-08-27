import "./CenterContent.css";
import FeedMain from "./feed/FeedMain.jsx";
//import UserProfile from "./feed/UserProfile.jsx";

function CenterContent({ myInfo }) {
  return (
    <div className="center_main">
      {/* 피드 메인과 기타등등 들어갈 곳 */}
      {/* {<FeedMain myInfo={myInfo} />} */}
      {/* {myInfo.length > 0 ? <UserProfile myInfo={myInfo} /> : "내 정보 로딩중"} */}
    </div>
  );
}

export default CenterContent;
