import "./CenterContent.css";
import FeedMain from  "./feed/FeedMain.jsx"

function CenterContent() {
    return (
        <div className="center_main">
            {/* 피드 메인과 기타등등 들어갈 곳 */}
            <FeedMain />
        </div>
    );
}

export default CenterContent;