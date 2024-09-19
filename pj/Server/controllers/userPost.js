const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");

module.exports = function (conn) {
  router.get("/userPosts/:user_no", decodeToken(), (req, res) => {
    const user_no = req.params.user_no; // 요청 파라미터에서 user_no 가져오기
    console.log("요청된 user_no:", user_no);
    const query = `SELECT u.user_no, p.post_id, p.post_text, p.createDate, p.modiDate, p.views, 
          u.user_id, up.nickname, up.image_url,
          GROUP_CONCAT(DISTINCT pf.file_path ORDER BY pf.upload_date SEPARATOR ', ') AS file_paths,
          COUNT(DISTINCT l.p_like_id) AS like_count,
          COUNT(DISTINCT c.comment_id) AS comment_count, p.board_info_id
          FROM posts p
          LEFT JOIN post_files pf ON p.post_id = pf.post_id
          LEFT JOIN User u ON p.user_no = u.user_no
          LEFT JOIN UserProfile up ON u.user_no = up.user_no
          LEFT JOIN post_likes l ON p.post_id = l.post_id
          LEFT JOIN comments c ON p.post_id = c.post_id
          WHERE u.user_no = ? AND p.isDeleted = 0
          GROUP BY u.user_no, p.post_id, p.post_text, p.createDate, p.modiDate, p.views, u.user_id, up.nickname, up.image_url, p.board_info_id`;

    conn.query(query, [user_no], (error, results) => {
      if (error) {
        console.error("쿼리 오류:", error);
        return res.status(500).json({ error: "서버 오류" });
      }
      console.log("쿼리 결과:", results);
      res.json(results);
    });
  });

  return router;
};
