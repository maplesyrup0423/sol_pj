const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");

module.exports = (conn) => {
    // 방 생성 API
    router.post("/createChatRoom", decodeToken(), (req, res) => {
    const { creator_user_no, room_name, user_list } = req.body;
    console.log("Request body:", req.body);

    if (!creator_user_no || !user_list) {
        return res.status(400).json({ error: 'creator_user_no 또는 user_list가 누락되었습니다.' });
    }

    const query = `CALL createChatRoom(?, ?, ?)`;

    conn.query(query, [creator_user_no, room_name, JSON.stringify(user_list)], (error, results) => {
        if (error) {
            console.error('방 생성 실패:', error);
            return res.status(500).json({ error: '방 생성 실패' });
        }
        
        console.log("Procedure results:", results);

        if (results && results[0] && results[0][0] && results[0][0].room_id) {
            const roomId = results[0][0].room_id;
            return res.json({ message: '방 생성 성공', room_id: roomId });
        } else if (results && results.insertId) {
            // OkPacket이 반환된 경우, insertId를 사용
            return res.json({ message: '방 생성 성공', room_id: results.insertId });
        } else {
            console.error('Unexpected result structure:', results);
            return res.status(500).json({ error: '방 생성 결과 처리 실패' });
        }
    });
});

    // 1:1 채팅방 확인 API
    router.post("/checkChatRoom", decodeToken(), (req, res) => {
    const { user1_no, user2_no } = req.body;
    console.log("reqbody값", req.body);
    
    const query = `SELECT cr.room_id
                   FROM ChatRoom cr
                   JOIN ChatRoomUser cru1 ON cr.room_id = cru1.room_id
                   JOIN ChatRoomUser cru2 ON cr.room_id = cru2.room_id
                   WHERE cr.is_group = 0
                   AND cru1.user_no = ?
                   AND cru2.user_no = ?`;

    conn.query(query, [user1_no, user2_no], (error, results) => {
        if (error) {
            console.error("1:1 채팅방 확인 중 오류 발생:", error);
            return res.status(500).json({ success: false, message: "서버 오류", error: error.message });
        }

        console.log("쿼리 결과:", results);

        if (Array.isArray(results) && results.length > 0) {
            res.json({ success: true, room_id: results[0].room_id });
        } else {
            res.json({ success: false });
        }
    });
});



    return router;
};
