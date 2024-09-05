import "./FeedDetail.css";

function FeedDetail({ post, onBack }) {

    return(
        <div className="feed-detail">
            <button onClick={onBack}>뒤로 가기</button>
            <h2>{post.post_text}</h2>
            <p>작성자: {post.nickname}</p>
            <p>조회수: {post.views}</p>
            {/* 기타 세부 정보 표시 */}
        </div>
    );
}

export default FeedDetail;