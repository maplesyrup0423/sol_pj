function setupChatModule(app, io, conn) {
// 날짜 포맷팅 
    const formatToMySQLDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toISOString().replace('T', ' ').slice(0, 19); // 'YYYY-MM-DD HH:MM:SS' 형식으로 변환
};
    // Socket.IO 이벤트 설정
    io.on('connection', (socket) => {
        console.log('새로운 클라이언트 연결');

        // 채팅방 참가
        socket.on('join_room', (room_id, user_no) => {
            socket.join(room_id);
            console.log(`${user_no}가 채팅방 ${room_id}에 참가함`);
        });
        
        // 메시지 전송
        socket.on('chat_message', (data) => {
            const { room_id, user_no, message_content } = data;

            // 사용자 정보 쿼리
            const query = 'SELECT image_url, nickname FROM userprofile WHERE user_no = ?';
            
            conn.query(query, [user_no], (error, results) => {
                if (error) {
                    console.error('쿼리 실행 오류:', error);
                    return;
                }

                // 사용자 정보가 존재하는 경우
                if (results.length > 0) {
                    const userProfile = results[0];
                    const { image_url, nickname } = userProfile;

                    // 메시지 데이터에 사용자 정보 추가
                    const messageData = {
                        user_no,
                        message_content,
                        user_name: nickname, // 사용자 닉네임
                        user_img_url: image_url, // 사용자 이미지 URL
                        created_at: new Date().toISOString() // 메시지 전송 시간
                    };
                    //포맷팅 사용
                    const formatTime = formatToMySQLDate(messageData.created_at);
                    // 해당 채팅방에 있는 모든 클라이언트에게 전송
                    io.to(room_id).emit('chat_message', messageData);
                    
                    // // // 메시지를 데이터베이스에 저장
                  const insertQuery = `INSERT INTO ChatMessage ( room_id,  user_no, message_content, created_at, status, is_edited, is_deleted) VALUES (?, ?, ?, ?, 'sent', FALSE, FALSE)`;
                    conn.query(insertQuery, [room_id, user_no, message_content, formatTime], (err) => {
                 if (err) {
                console.error('메시지 저장 오류:', err);
                    }
                });
                        }
                    });
                });

        // 연결 해제
        socket.on('disconnect', () => {
            console.log('클라이언트 연결 해제');
        });
    });

    // 채팅방 생성 API
    app.post('/chatrooms', (req, res) => {
        const { room_name } = req.body;
        const room_id = Date.now().toString();

        const query = 'INSERT INTO ChatRoom (room_id, room_name) VALUES (?, ?)';
        conn.query(query, [room_id, room_name], (err, result) => {
            if (err) {
                res.status(500).json({ error: '채팅방 생성 실패' });
            } else {
                res.status(201).json({ room_id, room_name });
            }
        });
    });

    // 채팅방 목록 조회 API
    app.get('/chatrooms', (req, res) => {
        const query = 'SELECT * FROM ChatRoom';
        conn.query(query, (err, results) => {
            if (err) {
                res.status(500).json({ error: '채팅방 목록 조회 실패' });
            } else {
                res.status(200).json(results);
            }
        });
    });

    // 채팅방 참가 API
    app.post('/chatrooms/:room_id/join', (req, res) => {
        const { room_id } = req.params;
        const { user_no } = req.body;

        const query = 'INSERT INTO ChatRoomUser (room_id, user_no, role, joined_at) VALUES (?, ?, ?, NOW())';
        conn.query(query, [room_id, user_no, 'member'], (err, result) => {
            if (err) {
                res.status(500).json({ error: '채팅방 참가 실패' });
            } else {
                res.status(200).json({ message: '채팅방 참가 성공' });
            }
        });
    });
}

module.exports = setupChatModule;
