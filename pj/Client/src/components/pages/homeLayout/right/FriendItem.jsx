import "./FriendItem.css";

function FriendItem({ ...f }) {
    return (
        <div className="friend-item">
            <div className="f-name">{f.f_name}</div>
            <div className="f-unread-count">{f.f_unread_count}</div>
        </div>
    );
}

export default FriendItem;
