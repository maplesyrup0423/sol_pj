import { useState, useEffect, useContext, useCallback } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import "./Messenger.css";
import MessengerUser from "./MessengerUser";
import { FaPlus } from "react-icons/fa";
import io from "socket.io-client";
import { AuthContext } from "../../../../Context/AuthContext";

function Messenger() {
  const { userInfo } = useContext(AuthContext);
  const { roomId: activeRoomId } = useParams(); // URL에서 현재 활성화된 방 ID를 가져옵니다
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

  const formatLastDate = useCallback((dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      console.error("유효하지 않은 날짜 형식:", dateString);
      return dateString;
    }
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };

    if (isToday(date)) {
      return date.toLocaleTimeString("ko-KR", options);
    } else {
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${month}/${day} ${date.toLocaleTimeString("ko-KR", options)}`;
    }
  }, []);

  const updateChatList = useCallback(
    (updatedChatList) => {
      const updatedList = updatedChatList.map((chat) => ({
        ...chat,
        room_name:
          chat.room_name === userInfo.nickname
            ? chat.last_sender
            : chat.room_name,
        last_date: formatLastDate(chat.last_date),
        unread_count:
          chat.room_id.toString() === activeRoomId ? 0 : chat.unread_count,
      }));
      setChatList(updatedList);
      setIsLoading(false);
    },
    [userInfo.nickname, formatLastDate, activeRoomId]
  );

  const handleNewMessage = useCallback(
    (data) => {
      const roomId = Number(data.room_id);
      const formattedDate = formatLastDate(data.last_message.created_at);
      const isSender = data.last_message.nickname === userInfo.nickname;
      const isActiveRoom = roomId.toString() === activeRoomId;

      setChatList((prevList) => {
        const existingChatIndex = prevList.findIndex(
          (chat) => chat.room_id === roomId
        );
        if (existingChatIndex !== -1) {
          const updatedList = [...prevList];
          updatedList[existingChatIndex] = {
            ...updatedList[existingChatIndex],
            unread_count:
              isActiveRoom || isSender
                ? 0
                : updatedList[existingChatIndex].unread_count + 1,
            last_date: formattedDate,
            last_chat: data.last_message.message_content,
            last_sender: data.last_message.nickname,
            room_name:
              updatedList[existingChatIndex].room_name === userInfo.nickname
                ? data.last_message.nickname
                : updatedList[existingChatIndex].room_name,
          };
          return updatedList;
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
    },
    [userInfo.nickname, activeRoomId, formatLastDate]
  );

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

    newSocket.on("chat_list_update", updateChatList);
    newSocket.on("new_message", handleNewMessage);

    newSocket.on("error", (errorMessage) => {
      console.error("소켓 에러:", errorMessage);
      setError(`서버 에러: ${errorMessage}`);
      setIsLoading(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userInfo.user_no, updateChatList, handleNewMessage]);

  useEffect(() => {
    if (activeRoomId) {
      setChatList((prevList) =>
        prevList.map((chat) =>
          chat.room_id.toString() === activeRoomId
            ? { ...chat, unread_count: 0 }
            : chat
        )
      );
    }
  }, [activeRoomId]);

  if (isLoading) {
    return <div>로딩 중...</div>;
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
            <Link
              to={`Room/${chat.room_id}`}
              key={chat.room_id}
              className="Link-hover"
            >
              <MessengerUser room_name={displayName} {...chat} />
            </Link>
          );
        })
      )}
      <div className="addMessengerbtn">
        <NavLink
          to={"chatFriendList"}
          className="Link-hover"
          style={{
            textDecoration: "none",
            color: "inherit",
            marginTop: "10px",
          }}
        >
          <div className="newChatRoom">
            <FaPlus size={30} />
            <span>새로운 채팅방</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default Messenger;
