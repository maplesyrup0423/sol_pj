import "./FriendItem.css";

function FriendItem({ ...f }) {
    return (
        <div className="friend-item">
            <div className="f-name">{f.following_nickname}</div>
            <div className="f-unread-count">0</div>
        </div>
    );
}

export default FriendItem;
