const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");

module.exports = (conn) => {
  // post DB값 받아오기
  router.get("/api/search/:searchKeyword", decodeToken(), (req, res) => {
    const searchKeyword = req.params.searchKeyword;
    const formattedKeyword = `%${searchKeyword}%`; // 와일드카드를 추가하여 키워드 포맷팅

    const query = `
      SELECT p.board_info_id, p.post_id, p.post_text, p.user_no, p.createDate, p.modiDate, p.views,
             GROUP_CONCAT(DISTINCT pf.file_path ORDER BY pf.upload_date SEPARATOR ', ') AS file_paths,
             u.user_id, up.nickname, up.image_url,
             COUNT(DISTINCT l.p_like_id) AS like_count,
             COUNT(DISTINCT c.comment_id) AS comment_count, up.introduce
      FROM posts p
      LEFT JOIN post_files pf ON p.post_id = pf.post_id
      LEFT JOIN User u ON p.user_no = u.user_no
      LEFT JOIN UserProfile up ON u.user_no = up.user_no
      LEFT JOIN post_likes l ON p.post_id = l.post_id
      LEFT JOIN comments c ON p.post_id = c.post_id
      WHERE p.isDeleted = 0 AND p.post_text LIKE ?
      GROUP BY p.post_id, p.post_text, p.user_no, p.createDate, p.modiDate, p.views, u.user_id, up.nickname, up.image_url;
    `;

    conn.query(query, [formattedKeyword], (err, rows, fields) => {
      if (err) {
        console.error("쿼리 실행 오류:", err);
        res.status(500).send("서버 오류");
      } else {
        res.send(rows);
      }
    });
  });

  return router;
};
