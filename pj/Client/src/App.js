import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [chatRooms, setChatRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [userId, setUserId] = useState(Date.now()); // 임시 사용자 ID

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/chatrooms');
      setChatRooms(response.data);
    } catch (error) {
      console.error('채팅방 목록 불러오기 실패:', error);
    }
  };

  const createChatRoom = async (roomName) => {
    try {
      const response = await axios.post('http://localhost:5000/chatrooms', { room_name: roomName });
      setChatRooms([...chatRooms, response.data]);
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
    }
  };

  const joinChatRoom = async (roomId) => {
    try {
      await axios.post(`http://localhost:5000/chatrooms/${roomId}/join`, { user_no: userId });
      setCurrentRoom(roomId);
      socket.emit('join room', roomId);
    } catch (error) {
      console.error('채팅방 참가 실패:', error);
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        {currentRoom ? (
          <ChatRoom roomId={currentRoom} userId={userId} socket={socket} onBack={() => setCurrentRoom(null)} />
        ) : (
          <ChatList
            chatRooms={chatRooms}
            onCreateRoom={createChatRoom}
            onJoinRoom={joinChatRoom}
          />
        )}
      </div>
    </div>
  );
}

export default App;