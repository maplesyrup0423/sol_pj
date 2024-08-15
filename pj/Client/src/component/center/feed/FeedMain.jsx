import "./FeedMain.css";
import Feed from "./Feed";
function FeedMain() {
    return (
        <div class="feed_main">
            <div class="order">
                인기 / 최신
            </div>

            <div class="posting">
                글쓰기 부분
            </div>

            <div class="feed">
                <Feed/>
            </div>
            
        </div>
    );
}

export default FeedMain;