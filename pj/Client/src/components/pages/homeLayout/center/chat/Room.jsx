import { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useInView } from "react-intersection-observer";
import { AuthContext } from "../../../../../Context/AuthContext";
import api from "../../../../auth/api";
import BasicButton from "../../../../utills/buttons/BasicButton";
import ChatMessage from "./ChatMessage";
import "./Room.css";
import { IoMdArrowRoundBack } from "react-icons/io";

function Room() {
  const { userInfo, accessToken, setUserInfo } = useContext(AuthContext);
  const { roomId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);
  const { ref, inView } = useInView({ threshold: 0 });

  // 유저 정보 체크 및 소켓 설정
  useEffect(() => {
    const checkUserInfo = async () => {
      if (!userInfo || !userInfo.user_no) {
        try {
          const response = await api.post("/api/user-info", {});
          setUserInfo(response.data);
        } catch (error) {
          console.error("유저정보를 가져올 수 없습니다:", error);
        }
      }
      setLoading(false); // 유저 정보 로드가 완료된 후 로딩 상태 해제
    };
    checkUserInfo();
  }, [userInfo, setUserInfo, accessToken]);

  // 소켓 초기화
  useEffect(() => {
    if (userInfo && userInfo.user_no && accessToken) {
      const newSocket = io("http://localhost:5000", {
        auth: { token: accessToken },
      });
      setSocket(newSocket);

      return () => {
        newSocket.close(); // 컴포넌트 언마운트 시 소켓 종료
      };
    }
  }, [userInfo, accessToken]);

  // 방 변경 시 메시지 초기화 및 소켓 이벤트 설정
  useEffect(() => {
    if (socket && userInfo && userInfo.user_no) {
      setLoading(true); // 로딩 시작
      setMessages([]); // 메시지 상태 초기화
      setHasMore(true); // 이전 메시지 로드 상태 초기화
      socket.emit("join_room", roomId, userInfo.user_no);

      // 소켓 이벤트 리스너 등록
      const handleInitialMessages = (initialMessages) => {
        setMessages(initialMessages);
        setHasMore(initialMessages.length === 20);
        setTimeout(() => {
          scrollToBottom();
        }, 100); // 초기 메시지 로딩 후 스크롤을 아래로
        setLoading(false); // 로딩 완료
      };

      const handleChatMessage = (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
        setTimeout(() => {
          scrollToBottom();
        }, 100); // 새 메시지가 오면 스크롤을 아래로
      };

      const handlePreviousMessages = (previousMessages) => {
        if (previousMessages.length > 0) {
          setMessages((prevMessages) => [...previousMessages, ...prevMessages]); // 이전 메시지를 추가
          setHasMore(previousMessages.length === 20); // 이전 메시지가 더 있는지 확인
        } else {
          setHasMore(false); // 이전 메시지가 더 이상 없으면 상태 업데이트
        }
      };

      socket.on("initial_messages", handleInitialMessages);
      socket.on("chat_message", handleChatMessage);
      socket.on("previous_messages", handlePreviousMessages);

      return () => {
        socket.off("initial_messages", handleInitialMessages);
        socket.off("chat_message", handleChatMessage);
        socket.off("previous_messages", handlePreviousMessages);
      };
    }
  }, [socket, userInfo, roomId]);

  useEffect(() => {
    if (inView && hasMore) {
      loadPreviousMessages();
    }
  }, [inView, hasMore]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && socket && userInfo && userInfo.user_no) {
      const messageData = {
        room_id: roomId,
        user_no: userInfo.user_no,
        message_content: inputMessage,
      };

      socket.emit("chat_message", messageData);
      setInputMessage("");
    }
  };

  const loadPreviousMessages = () => {
    if (socket && userInfo && userInfo.user_no && hasMore) {
      const oldestMessage = messages[0]; // 가장 오래된 메시지를 가져옵니다.
      const oldestMessageId = oldestMessage ? oldestMessage.message_id : null;

      if (oldestMessageId) {
        // 가장 오래된 메시지가 있을 때만 요청합니다.
        socket.emit("fetch_previous_messages", {
          room_id: roomId,
          oldest_message_id: oldestMessageId,
        });
      }
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>로딩중입니다</div>;
  }

  return (
    <div className="chatContainer">
      <div className="chat-header">
        <div className="BackIcon" onClick={handleBack}>
          <IoMdArrowRoundBack />
        </div>
        <span></span>
      </div>

      <div className="chat-Card" ref={chatContainerRef}>
        {hasMore && <div ref={ref} style={{ height: "20px" }}></div>}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.message_id}
            isMyChat={msg.user_no === userInfo.user_no}
            text={msg.message_content}
            nickname={msg.nickname}
            createdAt={msg.created_at}
            image_url={
              msg.image_url
                ? `${baseUrl}/images/uploads/${msg.image_url}`
                : `${baseUrl}/images/uploads/default-profile.png`
            }
          />
        ))}
      </div>
      <div className="chatRoom-formDiv">
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="chat-input"
            placeholder="글을 입력해주세요."
          />
          <BasicButton
            type="submit"
            btnSize="mediumButton"
            btnColor="yellowButton"
            btnText="전송"
          />
        </form>
      </div>
    </div>
  );
}

export default Room;
