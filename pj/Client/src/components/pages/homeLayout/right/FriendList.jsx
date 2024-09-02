import FriendItem from "./FriendItem";
import "./FriendList.css";
function FriendList() {
    const user = {
        name: "요한",
        user_no: 6,
        chatList: 2,
        friends: [
            {
                f_no: 1,
                f_name: "친구1",
                f_unread_count: 0,
            },
            {
                f_no: 1,
                f_name: "친구2",
                f_unread_count: 5,
            },
        ],
    };

    return (
        <div className="friendList">
            {user.friends.map((f) => (
                <FriendItem key={f.f_no} {...f} />
            ))}
        </div>
    );
}

export default FriendList;
