import "./ChatMessage.css";

function ChatMessage({ isMyChat, text }) {
    return (
        <div className={`chat-content ${isMyChat ? "my-chat" : "other-chat"}`}>
            {!isMyChat && (
                <div className="chat-img">
                    <img src="" alt="" />
                </div>
            )}
            <p>{text}</p>
        </div>
    );
}

export default ChatMessage;
