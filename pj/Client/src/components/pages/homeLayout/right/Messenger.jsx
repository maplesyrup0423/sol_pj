import { Link, NavLink } from "react-router-dom";
import "./Messenger.css";
import MessengerUser from "./MessengerUser";
import { FaPlus } from "react-icons/fa";

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
            {/* {chatList.map((chat) => (
                <Link to="chatRoom" key={chat.chat_no}>
                    <MessengerUser {...chat} />
                </Link>
            ))} */}
            <div className="addMessengerbtn">
                <NavLink
                    to={"chatFriendList"}
                    style={{
                        textDecoration: "none", // 밑줄 제거
                        color: "inherit", // 기본 텍스트 색상 유지
                    }}
                >
                    <FaPlus size={40} />
                    <span>새로운 채팅방</span>
                </NavLink>
            </div>
        </div>
    );
}

export default Messenger;
