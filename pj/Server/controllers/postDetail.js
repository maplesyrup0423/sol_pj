const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");

module.exports = (conn) => {
  // 게시물 세부 정보 조회 API
  router.get('/api/postDetail/:postId', decodeToken(), (req, res) => {
    const { postId } = req.params.postId;

    if (!postId) {
      return res.status(400).send("게시물 ID가 필요합니다.");
    }

    const query = `
      SELECT p.post_id, p.post_text, p.createDate, p.modiDate, p.views, 
             u.user_id, up.nickname, up.image_url,
             GROUP_CONCAT(DISTINCT pf.file_path ORDER BY pf.upload_date SEPARATOR ', ') AS file_paths,
             COUNT(DISTINCT l.p_like_id) AS like_count,
             COUNT(DISTINCT c.comment_id) AS comment_count
      FROM posts p
      LEFT JOIN post_files pf ON p.post_id = pf.post_id
      LEFT JOIN User u ON p.user_no = u.user_no
      LEFT JOIN UserProfile up ON u.user_no = up.user_no
      LEFT JOIN post_likes l ON p.post_id = l.post_id
      LEFT JOIN comments c ON p.post_id = c.post_id
      WHERE p.post_id = ? AND p.isDeleted = 0
      GROUP BY p.post_id, p.post_text, p.createDate, p.modiDate, p.views, u.user_id, up.nickname, up.image_url
    `;

    conn.query(query, [postId], (err, rows) => {
      if (err) {
        console.error("쿼리 실행 오류:", err);
        res.status(500).send("서버 오류");
      } else {
        if (rows.length > 0) {
          res.send(rows[0]); // 게시물 정보를 반환
        } else {
          res.status(404).send("게시물을 찾을 수 없습니다.");
        }
      }
    });
  });

  return router;
};