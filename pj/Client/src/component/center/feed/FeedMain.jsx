import "./FeedMain.css";
import Feed from "./Feed";
import Feeds from "./Feeds";
import Writing from "./Writing";

function FeedMain(props) {
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
        {/* 글쓰기 부분 
        todo DB insert문 만들기*/}
        <Writing image_url={props.image_url} />
      </div>

      <div className="feed">
        {/* 피드부분
          todo 게시판DB 받아오기 현재 하드코딩
        */}
        <Feeds />
        <Feeds />
      </div>
    </div>
  );
}

export default FeedMain;
