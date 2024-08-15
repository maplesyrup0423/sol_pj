import "./FeedMain.css";
import Feed from "./Feed";
function FeedMain() {
    return (
        <div className="feed_main">
            <div className="order">
                인기 / 최신
            </div>

            <div className="posting">
                글쓰기 부분
            </div>

            <div className="feed">
                <Feed/>
            </div>
            
        </div>
    );
}

export default FeedMain;