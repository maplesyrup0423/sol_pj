import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Messenger.css";
import MessengerUser from "./MessengerUser";
import { FaPlus } from "react-icons/fa";
import io from "socket.io-client";
import { AuthContext } from "../../../../Context/AuthContext";

function Messenger() {
  const { userInfo, activeRoom, setActiveRoom } = useContext(AuthContext);
  const [chatList, setChatList] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const formatLastDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      console.error("유효하지 않은 날짜 형식:", dateString);
      return dateString;
    }
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    const kstOffset = 9 * 60 * 60 * 1000;
    const localDate = new Date(date.getTime() + kstOffset);

    if (isToday(localDate)) {
      return localDate.toLocaleTimeString("ko-KR", options);
    } else {
      const month = String(localDate.getMonth() + 1).padStart(2, "0");
      const day = String(localDate.getDate()).padStart(2, "0");
      return `${month}/${day} ${localDate.toLocaleTimeString(
        "ko-KR",
        options
      )}`;
    }
  };

  useEffect(() => {
    const newSocket = io("http://localhost:5000/chatNotification", {
      transports: ["websocket"],
      upgrade: false,
    });
    setSocket(newSocket);

    const loadChatList = () => {
      setIsLoading(true);
      setError(null);
      newSocket.emit("get_chat_list", userInfo.user_no);
    };

    newSocket.on("connect", () => {
      newSocket.emit("register_user", userInfo.user_no);
      loadChatList();
    });

    newSocket.on("chat_list_update", (updatedChatList) => {
      const updatedList = updatedChatList.map((chat) => ({
        ...chat,
        room_name:
          chat.room_name === userInfo.nickname
            ? chat.last_sender
            : chat.room_name,
        last_date: formatLastDate(chat.last_date),
      }));
      setChatList(updatedList);
      setIsLoading(false);
    });

    newSocket.on("new_message", (data) => {
      const roomId = Number(data.room_id);
      const chat = chatList.find((chat) => chat.room_id === roomId);
      const formattedDate = formatLastDate(data.last_message.created_at);
      const isSender = data.last_message.nickname === userInfo.nickname;
      const isActiveRoom = roomId === Number(activeRoom);

      setChatList((prevList) => {
        if (chat) {
          return prevList.map((chat) =>
            chat.room_id === roomId
              ? {
                  ...chat,
                  unread_count:
                    isActiveRoom || isSender ? 0 : chat.unread_count + 1,
                  last_date: formattedDate,
                  last_chat: data.last_message.message_content,
                  last_sender: data.last_message.nickname,
                  room_name:
                    chat.room_name === userInfo.nickname
                      ? data.last_message.nickname
                      : chat.room_name,
                }
              : chat
          );
        } else {
          return [
            ...prevList,
            {
              room_id: roomId,
              room_name:
                userInfo.nickname === data.last_message.nickname
                  ? data.room_name
                  : data.last_message.nickname,
              unread_count: isSender || isActiveRoom ? 0 : 1,
              last_date: formattedDate,
              last_chat: data.last_message.message_content,
              last_sender: data.last_message.nickname,
            },
          ];
        }
      });
    });

    newSocket.on("error", (errorMessage) => {
      console.error("소켓 에러:", errorMessage);
      setError(`서버 에러: ${errorMessage}`);
      setIsLoading(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userInfo.user_no, activeRoom]); // activeRoom을 의존성 배열에 추가

  useEffect(() => {
    if (activeRoom) {
      setChatList((prevList) =>
        prevList.map((chat) =>
          chat.room_id === Number(activeRoom)
            ? { ...chat, unread_count: 0 }
            : chat
        )
      );
    }
  }, [activeRoom, chatList]);

  if (isLoading) {
    return;
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
          const displayName =
            chat.room_name === userInfo.nickname
              ? chat.last_sender
              : chat.room_name;
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
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <FaPlus size={40} />
          <span>새로운 채팅방</span>
        </NavLink>
      </div>
    </div>
  );
}

export default Messenger;
