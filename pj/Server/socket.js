const mysql = require("mysql");

function setupChatModule(app, io, conn) {
  // 날짜 포맷팅
  const formatToMySQLDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const correctedDate = new Date(date.getTime() - timezoneOffset);
    return correctedDate.toISOString().replace("T", " ").slice(0, 19);
  };

  // 메시지 조회
  function fetchMessages(room_id, oldest_message_id = null, limit = 20) {
    return new Promise((resolve, reject) => {
      let query;
      let params;

      if (oldest_message_id) {
        query = `
          SELECT m.*, up.nickname, up.image_url 
          FROM ChatMessage m 
          JOIN User u ON m.user_no = u.user_no 
          LEFT JOIN UserProfile up ON m.user_no = up.user_no
          WHERE m.room_id = ? AND m.message_id < ?
          ORDER BY m.message_id DESC
          LIMIT ?
        `;
        params = [room_id, oldest_message_id, limit];
      } else {
        query = `
          SELECT m.*, up.nickname, up.image_url 
          FROM ChatMessage m 
          JOIN User u ON m.user_no = u.user_no 
          LEFT JOIN UserProfile up ON m.user_no = up.user_no
          WHERE m.room_id = ?
          ORDER BY m.message_id DESC
          LIMIT ?
        `;
        params = [room_id, limit];
      }

      conn.query(query, params, (error, messages) => {
        if (error) {
          reject(error);
        } else {
          resolve(messages.reverse()); // 시간 순으로 정렬
        }
      });
    });
  }

  // 사용자 프로필 조회
  function getUserProfile(user_no) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT image_url, nickname FROM UserProfile WHERE user_no = ?";
      conn.query(query, [user_no], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  // 메시지 저장
  function saveMessage(room_id, user_no, message_content, created_at) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO ChatMessage (room_id, user_no, message_content, created_at, status, is_edited, is_deleted) 
                           VALUES (?, ?, ?, ?, 'sent', FALSE, FALSE)`;
      conn.query(
        query,
        [room_id, user_no, message_content, created_at],
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  }

  function getUnreadMessageCount(room_id, user_no, last_active_at) {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT COUNT(*) as unread_count
                FROM ChatMessage
                WHERE room_id = ? AND user_no != ? AND created_at > ?
            `;
      conn.query(
        query,
        [room_id, user_no, last_active_at],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0].unread_count);
          }
        }
      );
    });
  }

  function getLatestMessage(room_id) {
    return new Promise((resolve, reject) => {
      const query = `
            SELECT m.message_content, m.created_at, up.nickname
            FROM ChatMessage m
            JOIN User u ON m.user_no = u.user_no
            LEFT JOIN UserProfile up ON m.user_no = up.user_no
            WHERE m.room_id = ?
            ORDER BY m.message_id DESC
            LIMIT 1
        `;
      conn.query(query, [room_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  function getUserChatRooms(user_no) {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT cr.room_id, cr.room_name, cru.last_active_at
                FROM ChatRoom cr
                JOIN ChatRoomUser cru ON cr.room_id = cru.room_id
                WHERE cru.user_no = ?
            `;
      conn.query(query, [user_no], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  function getRoomName(room_id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT room_name FROM ChatRoom WHERE room_id = ?";
      conn.query(query, [room_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0] ? results[0].room_name : "Unknown Room");
        }
      });
    });
  }
  // 상대방 프로필 정보 가져오기
  function getOpponentProfile(room_id, user_no) {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT up.nickname, up.image_url
      FROM ChatRoomUser cru
      JOIN UserProfile up ON cru.user_no = up.user_no
      WHERE cru.room_id = ? AND cru.user_no != ?
      LIMIT 1
    `;
      conn.query(query, [room_id, user_no], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  // Socket.IO 이벤트 설정
  io.on("connection", (socket) => {
    console.log("새로운 클라이언트 연결");

    // 채팅방 참가
    socket.on("join_room", async (room_id, user_no) => {
      socket.room_id = room_id;
      socket.user_no = user_no;

      try {
        console.log(`채팅방 참가 요청: room_id=${room_id}, user_no=${user_no}`);

        const [userInRoom] = await new Promise((resolve, reject) => {
          conn.query(
            "SELECT * FROM ChatRoomUser WHERE room_id = ? AND user_no = ?",
            [room_id, user_no],
            (error, results) => {
              if (error) reject(error);
              else resolve(results);
            }
          );
        });

        console.log("채팅방 유저 정보:", userInRoom);

        let joined_at;
        if (!userInRoom) {
          console.log("새 유저입니다. 채팅방에 추가합니다.");
          await new Promise((resolve, reject) => {
            conn.query(
              "INSERT INTO ChatRoomUser (room_id, user_no) VALUES (?, ?)",
              [room_id, user_no],
              (error) => {
                if (error) reject(error);
                else resolve();
              }
            );
          });
          joined_at = new Date();
        } else {
          console.log("기존 유저입니다. 마지막 활동 시간을 업데이트합니다.");
          joined_at = userInRoom.joined_at;
          await new Promise((resolve, reject) => {
            conn.query(
              "UPDATE ChatRoomUser SET last_active_at = CURRENT_TIMESTAMP WHERE room_id = ? AND user_no = ?",
              [room_id, user_no],
              (error) => {
                if (error) reject(error);
                else resolve();
              }
            );
          });
        }

        console.log(`소켓 룸 조인: ${room_id}`);
        socket.join(room_id);

        const initialMessages = await fetchMessages(room_id);
        socket.emit("initial_messages", initialMessages);
      } catch (error) {
        console.error("채팅방 참가 오류:", error);
        socket.emit("error", "Failed to join the room");
      }
    });

    // 추가 메시지 요청 (페이지네이션)
    // 추가 메시지 요청 (페이지네이션)
    socket.on("fetch_previous_messages", async (data) => {
      try {
        const { room_id, oldest_message_id } = data;
        const messages = await fetchMessages(room_id, oldest_message_id);

        if (messages.length > 0) {
          socket.emit("previous_messages", messages);
        } else {
          console.log("더 이상 이전 메시지가 없습니다.");
        }
      } catch (error) {
        console.error("이전 메시지 조회 오류:", error);
        socket.emit("error", "Failed to fetch previous messages");
      }
    });

    // 메시지 전송
    socket.on("chat_message", async (data) => {
      try {
        const { room_id, user_no, message_content } = data;
        console.log(
          `메시지 전송: room_id=${room_id}, user_no=${user_no}, 내용=${message_content}`
        );

        const userProfile = await getUserProfile(user_no);
        if (userProfile) {
          const { image_url, nickname } = userProfile;

          const messageData = {
            user_no,
            message_content,
            nickname,
            image_url,
            created_at: new Date().toISOString(),
          };

          const formatTime = formatToMySQLDate(messageData.created_at);

          await saveMessage(room_id, user_no, message_content, formatTime);
          console.log("메시지 저장 완료");

          // 방에 있는 모든 사용자에게 메시지 전송 (발신자 포함)
          io.to(room_id).emit("chat_message", messageData);

          // 방 이름 가져오기
          const roomName = await getRoomName(room_id);

          // Notify all users in the room about the new message
          const roomUsers = await new Promise((resolve, reject) => {
            conn.query(
              "SELECT user_no, last_active_at FROM ChatRoomUser WHERE room_id = ?",
              [room_id],
              (error, results) => {
                if (error) reject(error);
                else resolve(results);
              }
            );
          });

          // 발신자를 포함해 모든 사용자에게 알림 전송
          for (const roomUser of roomUsers) {
            const unreadCount = await getUnreadMessageCount(
              room_id,
              roomUser.user_no,
              roomUser.last_active_at
            );
            chatNotificationSpace
              .to(`user_${roomUser.user_no}`)
              .emit("new_message", {
                room_id,
                room_name: roomName,
                last_message: messageData,
                unread_count: unreadCount,
              });
          }
        }
      } catch (error) {
        console.error("메시지 전송 오류:", error);
        socket.emit("error", "Failed to send message");
      }
    });

    // 연결 해제 시 last_active_at 업데이트
    socket.on("disconnect", async () => {
      console.log("클라이언트 연결 해제");
      const { room_id, user_no } = socket;
      if (room_id && user_no) {
        try {
          await new Promise((resolve, reject) => {
            const query =
              "UPDATE ChatRoomUser SET last_active_at = CURRENT_TIMESTAMP WHERE room_id = ? AND user_no = ?";
            conn.query(query, [room_id, user_no], (error) => {
              if (error) reject(error);
              else resolve();
            });
          });
          console.log(
            `last_active_at 업데이트 완료: room_id=${room_id}, user_no=${user_no}`
          );
        } catch (error) {
          console.error("last_active_at 업데이트 오류:", error);
        }
      }
    });
  });
  ////////////////////////////////알림 소켓 설정//////////////////////////////////////

  const chatNotificationSpace = io.of("/chatNotification");

  chatNotificationSpace.on("connection", (socket) => {
    console.log("알림스페이스 정상연결확인");

    socket.on("register_user", (user_no) => {
      console.log(`User ${user_no} registered for notifications`);
      socket.join(`user_${user_no}`);
    });

    socket.on("get_chat_list", async (user_no) => {
      try {
        console.log(`채팅 목록 요청 받음: user_no=${user_no}`);
        const chatRooms = await getUserChatRooms(user_no);
        const chatList = await Promise.all(
          chatRooms.map(async (room) => {
            const unreadCount = await getUnreadMessageCount(
              room.room_id,
              user_no,
              room.last_active_at
            );
            const latestMessage = await getLatestMessage(room.room_id);
            const opponentProfile = await getOpponentProfile(
              room.room_id,
              user_no
            );
            return {
              room_id: room.room_id,
              room_name: room.room_name,
              unread_count: unreadCount,
              last_date: latestMessage ? latestMessage.created_at : null,
              last_chat: latestMessage ? latestMessage.message_content : null,
              last_sender: latestMessage ? latestMessage.nickname : null,
              opponent_nickname: opponentProfile.nickname,
              opponent_image_url: opponentProfile.image_url,
            };
          })
        );
        socket.emit("chat_list_update", chatList);
      } catch (error) {
        console.error("채팅 목록 조회 오류:", error);
        socket.emit("error", "Failed to fetch chat list");
      }
    });
  });
}

module.exports = setupChatModule;
