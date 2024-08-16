import React, { useState } from 'react';

function ChatList({ chatRooms, onCreateRoom, onJoinRoom }) {
  const [newRoomName, setNewRoomName] = useState('');

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      onCreateRoom(newRoomName);
      setNewRoomName('');
    }
  };

  return (
    <div className="chat-list">
      <h2>채팅방 목록</h2>
      <ul>
        {chatRooms.map((room) => (
          <li key={room.room_id} className="chat-room-item">
            <div className="room-info">
              <span className="room-name">{room.room_name}</span>
            </div>
            <button onClick={() => onJoinRoom(room.room_id)}>참가</button>
          </li>
        ))}
      </ul>
      <div className="create-room">
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="새 채팅방 이름"
        />
        <button onClick={handleCreateRoom}>채팅방 생성</button>
      </div>
    </div>
  );
}

export default ChatList;