import { Link } from "react-router-dom";
import "./Messenger.css";
import MessengerUser from "./MessengerUser";

function Messenger() {
    const chatList = [
        {
            user_no: 6,
            chat_no: 1,
            img: "",
            room_name: "1번 채팅방",
            unread_count: 12,
            last_date: "2024-09-02",
            last_chat: "집가고싶다",
        },
    ];

    return (
        <div className="messenger">
            {chatList.map((chat) => (
                // <Link to={`/chatRoom/${chat.chat_no}`} key={chat.chat_no}>
                <Link to="chatRoom" key={chat.chat_no}>
                    <MessengerUser {...chat} />
                </Link>
            ))}
        </div>
    );
}

export default Messenger;
