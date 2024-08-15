import "./Feed.css";

function Feed() {
    return (
        <div className="feed-container">
            <div className="feed-header">
                <img className="user-avatar" src="user-avatar.jpg" alt="User Avatar" />
                <div className="user-info">
                    <span className="user-name">임○○</span>
                    <span className="user-id">@YJ24</span>
                    <span className="post-date">| 8월 2일</span>
                </div>
            </div>

            <div className="feed-image">
                <img src="screenshot.jpg" alt="Screenshot" />
            </div>

            <div className="feed-text">
                오늘 찍은 스샷 상태치?
            </div>

            <div className="feed-actions">
                <div className="like-comment">
                    <div className="icon like-icon">❤️</div>
                    <span>5</span>
                    <div className="icon comment-icon">💬</div>
                    <span>6</span>
                </div>
                <div className="share-icons">
                    <div className="icon share-icon">🔄</div>
                    <div className="icon send-icon">✉️</div>
                    <div className="icon more-icon">⋯</div>
                </div>
            </div>
        </div>
    );
}

export default Feed;