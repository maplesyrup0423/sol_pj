const express = require("express");
const router = express.Router();
require("dotenv").config();

module.exports = (conn) => {
    router.get("/followers", async (req, res) => {
        //console.log("서버쪽 followers 진입");
        const user_no = req.query.user_no; // req.query로 수정
        const followerQuery = `SELECT 
            u.user_id AS following_id,
            up.nickname AS following_nickname
        FROM 
            UserFollower uf
        JOIN 
            User u ON uf.following_no = u.user_no
        JOIN 
            UserProfile up ON u.user_no = up.user_no
        WHERE 
            uf.follower_no = ?`;

        conn.query(followerQuery, [user_no], (err, results) => {
            if (err) {
                console.log("팔로워 조회 중 에러 발생:", err);
                res.status(500).json({ success: false, message: "서버 오류" });
            } else {
                console.log("팔로워 조회 결과 : ", results);
                res.json({ success: true, followers: results });
            }
        });
    });
};

return router;
