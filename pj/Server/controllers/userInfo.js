const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");

module.exports = function (conn) {
  // 유저 정보를 가져오는 라우트
  router.get("/user-info/:user_id", decodeToken(), (req, res) => {
    const { user_id } = req.params;

    const query = `SELECT * FROM UserProfile WHERE user_id = ?`;
    conn.query(query, [user_id], (err, results) => {
      if (err) {
        console.error("쿼리 오류:", err);
        return res.status(500).json({ error: "서버 오류" });
      }

      if (results.length > 0) {
        res.status(200).json({ success: true, user: results[0] });
      } else {
        res
          .status(404)
          .json({ success: false, message: "유저를 찾을 수 없습니다." });
      }
    });
  });

  return router;
};
