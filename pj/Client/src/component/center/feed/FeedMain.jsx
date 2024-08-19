import "./FeedMain.css";
import Feed from "./Feed";
import Feeds from "./Feeds";
import Writing from "./Writing";

function FeedMain() {
  return (
    <div className="feed_main">
      <div className="order">
        <div className="popularity">
          <div>인기</div>
        </div>
        <div className="Latest">
          <div>최신</div>
        </div>
      </div>

      <div className="posting">
        {/* 글쓰기 부분 */}
        <Writing />
      </div>

      <div className="feed">
        {/* <Feed/> */}
        <Feeds />
        <Feeds />
      </div>
    </div>
  );
}

export default FeedMain;
