import React, { useState, useEffect, useRef } from 'react';

function ChatRoom({ roomId, userId, socket, onBack }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('chat message');
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (inputMessage.trim()) {
      socket.emit('chat message', {
        room_id: roomId,
        user_no: userId,
        message_content: inputMessage,
      });
      setInputMessage('');
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <button onClick={onBack}>뒤로</button>
        <h2>채팅방 {roomId}</h2>
      </div>
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.user_no === userId ? 'my-message' : 'other-message'}`}>
            {msg.message_content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
}

export default ChatRoom;