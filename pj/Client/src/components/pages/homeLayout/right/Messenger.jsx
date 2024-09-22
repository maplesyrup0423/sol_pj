import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink } from "react-router-dom";
import "./Messenger.css";
import MessengerUser from "./MessengerUser";
import { FaPlus } from "react-icons/fa";
import io from 'socket.io-client';
import { AuthContext } from '../../../../Context/AuthContext';

function Messenger() {
    const { userInfo } = useContext(AuthContext);
    const [chatList, setChatList] = useState([]);
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Messenger 컴포넌트 마운트");
        const newSocket = io('http://localhost:5000/chatNotification', {
            transports: ['websocket'],
            upgrade: false
        });
        setSocket(newSocket);

        const loadChatList = () => {
            console.log("채팅 목록 요청 중...");
            setIsLoading(true);
            setError(null);
            newSocket.emit('get_chat_list', userInfo.user_no);
        };

        newSocket.on('connect', () => {
            console.log('채팅 알림 공간에 연결되었습니다');
            newSocket.emit('register_user', userInfo.user_no);
            loadChatList();
        });

        newSocket.on('chat_list_update', (updatedChatList) => {
            console.log("채팅 목록 업데이트 받음:", updatedChatList);
            setChatList(updatedChatList);
            setIsLoading(false);
        });

        newSocket.on('new_message', (data) => {
            console.log("새 메시지 받음:", data);
            setChatList(prevList => {
                const existingChat = prevList.find(chat => chat.room_id === data.room_id);

                if (existingChat) {
                    // 기존 방이 있는 경우 업데이트
                    return prevList.map(chat => {
                        if (chat.room_id === data.room_id) {
                            return {
                                ...chat,
                                unread_count: data.unread_count,
                                last_date: data.last_message.created_at,
                                last_chat: data.last_message.message_content,
                                last_sender: data.last_message.nickname
                            };
                        }
                        return chat;
                    });
                } else {
                    // 방이 없으면 새로 추가
                    return [
                        ...prevList,
                        {
                            room_id: data.room_id,
                            unread_count: data.unread_count,
                            last_date: data.last_message.created_at,
                            last_chat: data.last_message.message_content,
                            last_sender: data.last_message.nickname
                        }
                    ];
                }
            });
        });

        newSocket.on('error', (errorMessage) => {
            console.error("소켓 에러:", errorMessage);
            setError(`서버 에러: ${errorMessage}`);
            setIsLoading(false);
        });

        return () => {
            console.log("Messenger 컴포넌트 언마운트");
            newSocket.disconnect();
        };
    }, [userInfo.user_no]);

    if (isLoading) {
        return <div>채팅방 목록을 불러오는 중... (로딩 시간: {Date.now()})</div>;
    }

    if (error) {
        return <div>에러 발생: {error}</div>;
    }

    return (
        <div className="messenger">
            {chatList.length === 0 ? (
                <div>채팅방이 없습니다.</div>
            ) : (
                chatList.map((chat) => (
                    <Link to={`Room/${chat.room_id}`} key={chat.room_id}>
                        <MessengerUser {...chat} />
                    </Link>
                ))
            )}
            <div className="addMessengerbtn">
                <NavLink
                    to={"chatFriendList"}
                    style={{
                        textDecoration: "none",
                        color: "inherit",
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
