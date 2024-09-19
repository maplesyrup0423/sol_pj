import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from 'socket.io-client';
import { AuthContext } from "../../../../../Context/AuthContext";
import api from '../../../../auth/api';
import BasicButton from "../../../../utills/buttons/BasicButton";
import ChatMessage from "./ChatMessage";
import "./Room.css";

function Room() {
    const { userInfo, accessToken, setUserInfo } = useContext(AuthContext);
    const { roomId } = useParams();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const chatEndRef = useRef(null);
    const messageListRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const prevScrollTopRef = useRef(0); // 스크롤 위치 저장
    const firstMessageRef = useRef(null); // 첫 번째 메시지 저장

    useEffect(() => {
        const checkUserInfo = async () => {
            if (!userInfo || !userInfo.user_no) {
                try {
                    const response = await api.post('/api/user-info', {});
                    setUserInfo(response.data);
                } catch (error) {
                    console.error("유저정보를 가져올수가 없습니다. :", error);
                }
            }
            setLoading(false);
        };

        checkUserInfo();
    }, [userInfo, setUserInfo, accessToken]);

    useEffect(() => {
        if (userInfo && userInfo.user_no && accessToken) {
            const newSocket = io('http://localhost:5000', {
                auth: { token: accessToken }
            });
            setSocket(newSocket);

            return () => newSocket.close();
        }
    }, [userInfo, accessToken]);

    useEffect(() => {
    if (socket && userInfo && userInfo.user_no) {
        socket.emit('join_room', roomId, userInfo.user_no);

        socket.on('initial_messages', (initialMessages) => {
            setMessages(initialMessages.reverse());
            setHasMore(initialMessages.length === 20);
            setIsInitialLoad(false);
            scrollToBottom();
        });

        socket.on('chat_message', (data) => {
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, data];
                const isAtBottom = messageListRef.current.scrollHeight - messageListRef.current.clientHeight <= messageListRef.current.scrollTop + 1;
                
                if (isAtBottom) {
                    scrollToBottom();
                }
                return updatedMessages;
            });
        });

        socket.on('additional_messages', (additionalMessages) => {
            // 현재 스크롤 위치와 스크롤 높이를 기록
            const prevScrollHeight = messageListRef.current.scrollHeight;
            const prevScrollTop = messageListRef.current.scrollTop;

            setMessages((prevMessages) => {
                const newMessages = [...additionalMessages.reverse(), ...prevMessages];
                return newMessages;
            });

            setTimeout(() => {
                // 메시지 추가 후 스크롤 위치 복원
                const newScrollHeight = messageListRef.current.scrollHeight;
                messageListRef.current.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
            }, 0);  // 바로 적용되도록 짧은 딜레이 사용

            setHasMore(additionalMessages.length === 20);
        });

        return () => {
            socket.off('initial_messages');
            socket.off('chat_message');
            socket.off('additional_messages');
        };
    }
}, [socket, userInfo, isInitialLoad, roomId]);


    const scrollToBottom = () => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() && socket && userInfo && userInfo.user_no) {
            const messageData = {
                room_id: roomId,
                user_no: userInfo.user_no,
                message_content: inputMessage,
            };

            socket.emit('chat_message', messageData);
            setInputMessage('');

            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    };

    const loadMoreMessages = () => {
        if (socket && userInfo && userInfo.user_no && hasMore) {
            const oldestMessage = messages[0];
            const oldestMessageDate = oldestMessage ? new Date(oldestMessage.created_at) : new Date();

            socket.emit('fetch_more_messages', {
                room_id: roomId,
                joined_at: oldestMessageDate.toISOString(),
                page: page + 1,
                pageSize: 20
            });
            setPage(prevPage => prevPage + 1);
        }
    };

    const handleScroll = () => {
        const { scrollTop } = messageListRef.current;
        if (scrollTop === 0 && hasMore && !isInitialLoad) {
            loadMoreMessages();
        }
    };

    if (loading) {
        return <div>로딩중입니다</div>;
    }

    return (
        <div className="chatContainer">
            <div className="chat-Card" ref={messageListRef} onScroll={handleScroll}>
                {messages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        isMyChat={msg.user_no === userInfo.user_no}
                        text={msg.message_content}
                        nickname={msg.nickname}
                        createdAt={msg.created_at}
                        image_url={msg.image_url}
                    />
                ))}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <BasicButton type="submit">전송</BasicButton>
            </form>
        </div>
    );
}

export default Room;
