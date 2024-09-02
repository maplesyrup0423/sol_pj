import "./Messenger.css";
import MessengerUser from "./MessengerUser";

function Messenger() {
    const user = {
        name: "요한",
        user_no: 6,
        chatList: 2,
    };
    const chat = [
        {
            chat_no: 1,
            img: "",
            room_name: "1번 채팅방",
            unread_count: 12,
        },
    ];
    return (
        <div className="messenger">
            <MessengerUser />
        </div>
    );
}

export default Messenger;
