import "./Messenger.css";
import MessengerUser from "./MessengerUser";

function Messenger() {
    // const user = {
    //     name: "요한",
    //     user_no: 6,
    //     chatList: 2,
    // };

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
        {
            user_no: 6,
            chat_no: 2,
            img: "",
            room_name: "2번 채팅방",
            unread_count: 5,
            last_date: "2024-09-01",
            last_chat: "작업이최고야",
        },
    ];

    return (
        <div className="messenger">
            {chatList.map((chat) => (
                <MessengerUser key={chat.chat_no} {...chat} />
            ))}
        </div>
    );
}

export default Messenger;
