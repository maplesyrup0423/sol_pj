import { useContext, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import { AuthContext } from "../../../../../Context/AuthContext";
import api from '../../../../auth/api';
import BasicButton from "../../../../utills/buttons/BasicButton";
import ChatMessage from "./ChatMessage";
import "./Room.css";

function Room() {
    const { userInfo, setUserInfo, accessToken } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const chatEndRef = useRef(null);
    const messageListRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const prevScrollHeightRef = useRef(0); // 이전 스크롤 높이 저장

    useEffect(() => {
        const checkUserInfo = async () => {
            if (!userInfo || !userInfo.user_no) {
                try {
                    const response = await api.post('/user-info', {});
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
            const roomId = '123'; // 임시 roomId
            socket.emit('join_room', roomId, userInfo.user_no);

            socket.on('initial_messages', (initialMessages) => {
                setMessages(initialMessages.reverse());
                setHasMore(initialMessages.length === 20);
                setIsInitialLoad(false);
                scrollToBottom(); // 초기 로딩 시 최하단으로 스크롤 이동
            });

            socket.on('chat_message', (data) => {
                setMessages((prevMessages) => {
                    // 메시지가 추가되기 전의 스크롤 높이
                    const prevScrollHeight = messageListRef.current.scrollHeight;

                    // 메시지 추가
                    const updatedMessages = [...prevMessages, data];

                    // 메시지가 추가된 후의 스크롤 높이
                    const newScrollHeight = messageListRef.current.scrollHeight;

                    // 스크롤 위치 조정
                    const isAtBottom = messageListRef.current.scrollHeight - messageListRef.current.clientHeight <= messageListRef.current.scrollTop + 1;

                    if (isAtBottom) {
                        scrollToBottom(); // 현재 스크롤이 최하단에 있을 때만 이동
                    } else {
                        // 스크롤 위치를 이전 높이에서 증가한 부분만큼 조정
                        messageListRef.current.scrollTop += newScrollHeight - prevScrollHeight;
                    }

                    return updatedMessages;
                });
            });

            socket.on('additional_messages', (additionalMessages) => {
                setMessages((prevMessages) => {
                    const messageList = messageListRef.current;
                    const previousScrollTop = messageList.scrollTop;

                    const newMessages = [...additionalMessages.reverse(), ...prevMessages];
                    
                    setTimeout(() => {
                        messageList.scrollTop = previousScrollTop + (messageList.scrollHeight - previousScrollTop - messageList.clientHeight);
                    }, 0);

                    return newMessages;
                });
                setHasMore(additionalMessages.length === 20);
            });

            return () => {
                socket.off('initial_messages');
                socket.off('chat_message');
                socket.off('additional_messages');
            };
        }
    }, [socket, userInfo, isInitialLoad]);

    const scrollToBottom = () => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() && socket && userInfo && userInfo.user_no) {
            const roomId = '123'; // 임시 roomId
            const messageData = {
                room_id: roomId,
                user_no: userInfo.user_no,
                message_content: inputMessage,
            };

            socket.emit('chat_message', messageData);
            setInputMessage('');
        }
    };

    const loadMoreMessages = () => {
        if (socket && userInfo && userInfo.user_no && hasMore) {
            const roomId = '123'; // 임시 roomId
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
        const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
        if (scrollTop === 0 && hasMore && !isInitialLoad) {
            loadMoreMessages();
        }
    };

    useEffect(() => {
        if (isInitialLoad && messageListRef.current) {
            const { scrollHeight, clientHeight } = messageListRef.current;
            messageListRef.current.scrollTop = scrollHeight - clientHeight;
        }
    }, [messages, isInitialLoad]);

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
    );
}

export default Room;
