const express = require("express");
const router = express.Router();

module.exports = (conn) => {
    router.get("/follower", async (req, res) => {
        const userId = req.body.userId;
        //이 계정에서 팔로우한 모든 계정을 반환하는 쿼리
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
            uf.follower_no = '?'
        `;
        conn.query(followerQuery, [userId], (err, results) => {
            if (err) {
                console.log("팔로워 조회 중 에러 발생 임요한을 불럿");
            } else {
                console.log("팔로워 조회 결과 : ", results);
                res.json(results);
            }
        });
    });
};

return router;
