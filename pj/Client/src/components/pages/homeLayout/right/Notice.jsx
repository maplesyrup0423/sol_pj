import { useEffect, useState } from "react";
import "./Notice.css";
import { FaRegBell } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Notice() {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const eventSource = new EventSource("http://localhost:5000/notification", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 서버로부터 메시지를 받을 때마다 처리
    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setUnreadCount((prevCount) => prevCount + 1);
    };

    // 컴포넌트가 언마운트될 때 이벤트 소스 연결 해제
    return () => eventSource.close();
  }, []);

  return (
    <div className="notice">
      <div className="notice_alert">
        <div className="alert_icon">
          <FaRegBell className="FaRegBell" />
        </div>
        <div className="alert_text">알림</div>
        <div className="alert_number">
          <span>{unreadCount}</span>
        </div>
      </div>
      {messages.map((m) => (
        <div key={m.id}>받은 메세지 : {m.content}</div>
      ))}
      <NavLink
        to={`/Bookmark`}
        style={({ isActive }) => ({
          fontWeight: isActive ? "bold" : "normal",
          color: isActive ? "#ffcd19" : "white",
          textDecoration: "none",
        })}
      >
        {({ isActive }) => (
          <div className="notice_bookMark">
            <div className="bookMark_icon">
              {isActive ? (
                <FaBookmark className="FaBookmark" /> // 활성화 시 아이콘 변경
              ) : (
                <FaRegBookmark className="FaRegBookmark" /> // 기본 아이콘
              )}
            </div>
            <div className="bookMark_text">북마크</div>
          </div>
        )}
      </NavLink>
    </div>
  );
}

export default Notice;
