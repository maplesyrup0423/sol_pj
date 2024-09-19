const mysql = require('mysql');

function setupChatModule(app, io, conn) {
    // 날짜 포맷팅 
   const formatToMySQLDate = (isoDateString) => {
    const date = new Date(isoDateString);

    // 로컬 타임존에 맞게 시간 차이를 보정
    const timezoneOffset = date.getTimezoneOffset() * 60000; // 분 단위의 오프셋을 밀리초로 변환
    const correctedDate = new Date(date.getTime() - timezoneOffset);

    // 'YYYY-MM-DD HH:MM:SS' 형식으로 변환
    return correctedDate.toISOString().replace('T', ' ').slice(0, 19);
};

    // 분리된 함수: 페이지네이션을 적용한 메시지 조회
    function fetchPaginatedMessages(room_id, joined_at, page, pageSize) {
        return new Promise((resolve, reject) => {
            const offset = (page - 1) * pageSize;
            const query = `
                SELECT m.*, up.nickname, up.image_url 
                FROM ChatMessage m 
                JOIN User u ON m.user_no = u.user_no 
                LEFT JOIN UserProfile up ON m.user_no = up.user_no
                WHERE m.room_id = ? AND m.created_at > ?
                ORDER BY m.created_at DESC
                LIMIT ? OFFSET ?
            `;

            conn.query(query, [room_id, joined_at, pageSize, offset], (error, messages) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(messages);
                }
            });
        });
    }

    // 분리된 함수: 사용자 정보 조회
    function getUserProfile(user_no) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT image_url, nickname FROM UserProfile WHERE user_no = ?';
            conn.query(query, [user_no], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
    }

    // 분리된 함수: 메시지 저장
    function saveMessage(room_id, user_no, message_content, created_at) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO ChatMessage (room_id, user_no, message_content, created_at, status, is_edited, is_deleted) 
                           VALUES (?, ?, ?, ?, 'sent', FALSE, FALSE)`;
            conn.query(query, [room_id, user_no, message_content, created_at], (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    // Socket.IO 이벤트 설정
    io.on('connection', (socket) => {
        console.log('새로운 클라이언트 연결');

        // 채팅방 참가
        socket.on('join_room', async (room_id, user_no) => {
            try {
                console.log(`채팅방 참가 요청: room_id=${room_id}, user_no=${user_no}`);
                
                const [userInRoom] = await new Promise((resolve, reject) => {
                    conn.query('SELECT * FROM ChatRoomUser WHERE room_id = ? AND user_no = ?', [room_id, user_no], (error, results) => {
                        if (error) reject(error);
                        else resolve(results);
                    });
                });

                console.log('채팅방 유저 정보:', userInRoom);

                let joined_at;
                if (!userInRoom) {
                    console.log('새 유저입니다. 채팅방에 추가합니다.');
                    await new Promise((resolve, reject) => {
                        conn.query('INSERT INTO ChatRoomUser (room_id, user_no) VALUES (?, ?)', [room_id, user_no], (error) => {
                            if (error) reject(error);
                            else resolve();
                        });
                    });
                    joined_at = new Date();
                } else {
                    console.log('기존 유저입니다. 마지막 활동 시간을 업데이트합니다.');
                    joined_at = userInRoom.joined_at;
                    await new Promise((resolve, reject) => {
                        conn.query('UPDATE ChatRoomUser SET last_active_at = CURRENT_TIMESTAMP WHERE room_id = ? AND user_no = ?', [room_id, user_no], (error) => {
                            if (error) reject(error);
                            else resolve();
                        });
                    });
                }

                console.log(`소켓 룸 조인: ${room_id}`);
                socket.join(room_id);

                const initialMessages = await fetchPaginatedMessages(room_id, joined_at, 1, 20);
                
                socket.emit('initial_messages', initialMessages);


                 // nickname과 image_url을 user_name과 user_img_url로 변경
             

                socket.emit('initial_messages', initialMessages);

            } catch (error) {
                console.error('채팅방 참가 오류:', error);
                socket.emit('error', 'Failed to join the room');
            }
        });
        
        // 추가 메시지 요청 (페이지네이션)
        socket.on('fetch_more_messages', async (data) => {
            try {
                const { room_id, joined_at, page, pageSize } = data;
                console.log(`추가 메시지 요청: room_id=${room_id}, joined_at=${joined_at}, page=${page}, pageSize=${pageSize}`);
                
                const messages = await fetchPaginatedMessages(room_id, joined_at, page, pageSize);
                socket.emit('additional_messages', messages);
            } catch (error) {
                console.error('페이지네이션 메시지 조회 오류:', error);
                socket.emit('error', 'Failed to fetch messages');
            }
        });

        // 메시지 전송
        socket.on('chat_message', async (data) => {
            try {
                const { room_id, user_no, message_content } = data;
                console.log(`메시지 전송: room_id=${room_id}, user_no=${user_no}, 내용=${message_content}`);

                const userProfile = await getUserProfile(user_no);
                if (userProfile) {
                    const { image_url, nickname } = userProfile;

                    const messageData = {
                        user_no,
                        message_content,
                       nickname,
                        image_url,
                        created_at: new Date().toISOString()
                    };

                    const formatTime = formatToMySQLDate(messageData.created_at);
                    
                    console.log('메시지 데이터:', messageData);
                    await saveMessage(room_id, user_no, message_content, formatTime);
                    console.log('메시지 저장 완료');

                    io.to(room_id).emit('chat_message', messageData);
                }
            } catch (error) {
                console.error('메시지 전송 오류:', error);
                socket.emit('error', 'Failed to send message');
            }
        });

        // 연결 해제
        socket.on('disconnect', () => {
            console.log('클라이언트 연결 해제');
        });
    });
}

module.exports = setupChatModule;
