import "./ChatMessage.css";

function ChatMessage({ isMyChat, text, nickname, createdAt, image_url }) {
  // 한국 시간으로 변환 함수
  const toKoreanTime = (date) => {
    return new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9로 조정
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const messageDate = new Date(dateString); // 먼저 Date 객체로 변환
    const koreanDate = toKoreanTime(messageDate); // 한국 시간으로 변환
    const today = new Date();
    const isToday =
      today.getFullYear() === messageDate.getFullYear() &&
      today.getMonth() === messageDate.getMonth() &&
      today.getDate() === messageDate.getDate();

    // 포맷 옵션
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };

    const dateOptions = {
      month: "numeric",
      day: "numeric",
    };

    // 오전/오후 구분
    const hour = messageDate.getHours();
    const period = hour >= 12 ? "오후" : "오전";
    const formattedHour = hour % 12 || 12; // 12시간제로 변환

    // 날짜 포맷
    const formattedDate = `${
      messageDate.getMonth() + 1
    }/${messageDate.getDate()} ${period} ${formattedHour}:${messageDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    return isToday
      ? new Intl.DateTimeFormat("ko-KR", timeOptions).format(messageDate)
      : formattedDate;
  };

  return (
    <div className={`chat-wrapper ${isMyChat ? "my-chat" : "other-chat"}`}>
      {!isMyChat && (
        <div className="chat-user-info">
          <div className="chat-img">
            <img src={image_url} alt="User" />
          </div>
        </div>
      )}
      <div className="chat-bubble-container">
        {!isMyChat && (
          <div className="chat-nickname">{nickname || "Unknown"}</div>
        )}
        <div className="chat-bubble">
          <p>{text}</p>
        </div>
        <div className="time">{formatDate(createdAt)}</div>
      </div>
    </div>
  );
}

export default ChatMessage;
