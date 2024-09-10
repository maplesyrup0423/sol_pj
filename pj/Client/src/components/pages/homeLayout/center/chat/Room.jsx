import BasicButton from "../../../../utills/buttons/BasicButton";
import "./Room.css";
import ChatMessage from "./ChatMessage";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import { io } from 'socket.io-client';
import api from '../../../../auth/api'; // axios를 사용한다고 가정

function Room() {
    const { userInfo, setUserInfo, accessToken } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const chatEndRef = useRef(null);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    // 사용자 정보 확인
    useEffect(() => {
        const checkUserInfo = async () => {
            if (!userInfo || !userInfo.user_no) {
                try {
                    const response = await api.get('/api/user-info', {
                        
                    });
                    setUserInfo(response.data);
                } catch (error) {
                    console.error("Failed to fetch user info:", error);
                   // window.location.href = '/login';
                }
            }
            setLoading(false); // 사용자 정보 로드 완료
        };

        checkUserInfo();
    }, [userInfo, setUserInfo, accessToken]);

    // 소켓 연결
    useEffect(() => {
        if (userInfo && userInfo.user_no && accessToken) {
            const newSocket = io('http://localhost:5000', {
                auth: {
                    token: accessToken
                }
            });
            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, [userInfo, accessToken]);

    // 메시지 스크롤
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 메시지 수신
    useEffect(() => {
        if (socket && userInfo && userInfo.user_no) {
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
        }
    }, [socket, userInfo]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() && socket && userInfo && userInfo.user_no) {
            const roomId = '123'; // 임시 하드코딩
            const messageData = {
                room_id: roomId,
                user_no: userInfo.user_no,
                message_content: inputMessage,
            };
           
            socket.emit('chat_message', messageData);
            setInputMessage('');
        }
    };

    if (loading) {
        return <div>로딩중입니다</div>; // 사용자 정보 로딩 중
    }

    

    return (
        <>
            <div className="chatContainer">
                <div className="chat-Card">
                    {messages.map((msg, index) => {
                        console.log({
                            msgUserNo: msg.user_no,
                            userInfoUserNo: userInfo.user_no,
                            isMyChat: msg.user_no === userInfo.user_no
                        });
                        console.log("Message data:", msg);  // 각 메시지 데이터 로깅
                        
                        return (
                            <ChatMessage
                                key={index}
                                isMyChat={msg.user_no === userInfo.user_no}
                                text={msg.message_content}
                                userName={msg.user_name}
                                createdAt={msg.created_at}
                                userImg={msg.user_img_url}
                            />
                        );
                    })}
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
