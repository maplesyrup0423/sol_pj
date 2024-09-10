import "./ChatMessage.css";

function ChatMessage({ isMyChat, text, userName, createdAt, userImg }) {
    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const messageDate = new Date(dateString);
        const today = new Date();
        
        const isToday = 
            today.getFullYear() === messageDate.getFullYear() &&
            today.getMonth() === messageDate.getMonth() &&
            today.getDate() === messageDate.getDate();
        
        // 시간 포맷
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit'
        };

        // 날짜 포맷
        const dateOptions = {
            month: 'numeric',
            day: 'numeric'
        };

        return isToday
            ? new Intl.DateTimeFormat('ko-KR', timeOptions).format(messageDate)
            : new Intl.DateTimeFormat('ko-KR', dateOptions).format(messageDate);
    };

    return (
        <div className={`chat-wrapper ${isMyChat ? "my-chat" : "other-chat"}`}>
            {!isMyChat && (
                <div className="chat-user-info">
                    <div className="chat-img">
                        <img src={userImg} alt="User" />
                    </div>
                    <div className="chat-nickname">{userName || "Unknown"}</div>
                </div>
            )}
            <div className="chat-bubble-container">
                <div className="chat-bubble">
                    <p>{text}</p>
                </div>
                <div className="time">{formatDate(createdAt)}</div>
            </div>
        </div>
    );
}

export default ChatMessage;
