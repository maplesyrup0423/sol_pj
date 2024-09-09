import BasicButton from "../../../../utills/buttons/BasicButton";
import "./Room.css";
import ChatMessage from "./ChatMessage";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import { io } from 'socket.io-client';

function Room() {
    const { userInfo } = useContext(AuthContext);
    const [socket] = useState(() => io('http://localhost:5000'));
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const chatEndRef = useRef(null);

    // 메시지 스크롤
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const roomId = '123'; // 임시 하드코딩
        socket.emit('join_room', roomId, userInfo.user_no);

        // 메시지 수신 이벤트 핸들러
        const handleChatMessage = (data) => {
            console.log('수신메세지:', data); // 수신된 메시지 확인
            setMessages((prevMessages) => [...prevMessages, data]);
            scrollToBottom();
        };

        socket.on('chat_message', handleChatMessage);

        // Clean up
        return () => {
            socket.off('chat_message', handleChatMessage);
        };
    }, [socket, userInfo.user_no]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const roomId = '123'; 
            const messageData = {
                room_id: roomId,
                user_no: userInfo.user_no,
                message_content: inputMessage,
            };
            console.log('전송메세지 :', messageData); // 전송할 메시지 확인
            socket.emit('chat_message', messageData);
            setInputMessage('');
        }
    };

    return (
        <>
            <div className="chatContainer">
                <div className="chat-Card">
                    {messages.map((msg, index) => (
                        <ChatMessage
                            key={index}
                            isMyChat={msg.user_no === userInfo.user_no}
                            text={msg.message_content}
                        />
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMessage}>
                    <div className="chat-input-box">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                        />
                    </div>
                    <BasicButton
                        btnSize={"mediumButton"}
                        btnText={"전송"}
                        btnColor={"yellowButton"}
                    />
                </form>
            </div>
        </>
    );
}

export default Room;
