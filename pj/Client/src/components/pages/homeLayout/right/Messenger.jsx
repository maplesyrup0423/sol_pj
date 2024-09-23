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

    const isToday = (date) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
};

const formatLastDate = (dateString) => {
    // ISO 형식의 날짜 문자열을 Date 객체로 변환
    const date = new Date(dateString);

    if (isNaN(date)) {
        console.error("유효하지 않은 날짜 형식:", dateString);
        return dateString; // 유효하지 않은 경우 원본 문자열 반환
    }

    // 한국 시간으로 변환
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const kstOffset = 9 * 60 * 60 * 1000; // KST는 UTC+9
    const localDate = new Date(date.getTime() + kstOffset);

    if (isToday(localDate)) {
        return localDate.toLocaleTimeString('ko-KR', options); // 오늘이면 오전/오후 hh:mm 형식
    } else {
        const month = String(localDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(localDate.getDate()).padStart(2, '0');
        return `${month}/${day} ${localDate.toLocaleTimeString('ko-KR', options)}`; // MM/dd hh:mm 형식
    }
};
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
    const updatedList = updatedChatList.map(chat => ({
        ...chat,
        room_name: chat.room_name === userInfo.nickname ? chat.last_sender : chat.room_name, // 초기 방 이름 설정
        last_date: formatLastDate(chat.last_date),
    }));
    setChatList(updatedList);
    setIsLoading(false);
});


   newSocket.on('new_message', (data) => {
    console.log("새 메시지 받음:", data);
    console.log("메시지 생성 시간:", data.last_message.created_at);
    setChatList(prevList => {
        const roomId = Number(data.room_id); // room_id 형변환
        const chat = prevList.find(chat => chat.room_id === roomId); // room_id로 체크
         const formattedDate = formatLastDate(data.last_message.created_at);
        if (chat) {
            console.log(`채팅방 업데이트: room_id=${roomId}`);
            return prevList.map(chat =>
                chat.room_id === roomId
                    ? {
                        ...chat,
                        unread_count: chat.unread_count + 1,
                        last_date: formattedDate,
                        last_chat: data.last_message.message_content,
                        last_sender: data.last_message.nickname,
                        room_name: chat.room_name === userInfo.nickname ? data.last_message.nickname : chat.room_name // 닉네임에 따라 방 이름 변경
                    }
                    : chat
            );
        } else {
            console.log(`새 채팅방 추가: room_id=${roomId}`);
            return [
                ...prevList,
                {
                    room_id: roomId,
                    room_name: userInfo.nickname === data.last_message.nickname 
                    ? data.room_name 
                    : data.last_message.nickname,
                    unread_count: 1,
                    last_date: formattedDate,
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
            chatList.map((chat) => {
                const displayName = chat.room_name === userInfo.nickname ? chat.last_sender : chat.room_name; // 조건에 따라 이름 설정
                return (
                    <Link to={`Room/${chat.room_id}`} key={chat.room_id}>
                        <MessengerUser room_name={displayName} {...chat} />
                    </Link>
                );
            })
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
