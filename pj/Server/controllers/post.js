const express = require("express");
const router = express.Router();
const decodeToken = require("./decodeToken");

// post DB값 받아오기
module.exports = (conn) => {
  router.get("/post", (req, res) => {
    const board_info_id = req.query.board_info_id; // 쿼리 파라미터로 게시판 ID 받아오기

    // 게시판 ID가 제공되지 않은 경우 처리
    if (!board_info_id) {
      return res.status(400).send("게시판 ID가 필요합니다.");
    }
    conn.query(
      "SELECT p.board_info_id, p.post_id,p.post_text,p.user_no,p.createDate,p.modiDate, p.views," +
        " GROUP_CONCAT(  DISTINCT pf.file_path ORDER BY pf.upload_date SEPARATOR ', ') AS file_paths," +
        " u.user_id,up.nickname,up.image_url," +
        " COUNT(DISTINCT l.p_like_id) AS like_count, " +
        " COUNT(DISTINCT c.comment_id) AS comment_count " +
        " FROM posts p" +
        " LEFT JOIN post_files pf ON p.post_id = pf.post_id" +
        " LEFT JOIN User u ON p.user_no = u.user_no" +
        " LEFT JOIN UserProfile up ON u.user_no = up.user_no" +
        " LEFT JOIN post_likes l ON p.post_id = l.post_id" +
        " LEFT JOIN comments c ON p.post_id = c.post_id " +
        " WHERE p.board_info_id = ? and  p.isDeleted=0" +
        " GROUP BY p.post_id, p.post_text, p.user_no, p.createDate, p.modiDate, p.views, u.user_id, up.nickname, up.image_url" +
        " ORDER BY p.createDate DESC",
      [board_info_id],
      (err, rows, fields) => {
        if (err) {
          console.error("쿼리 실행 오류:", err);
          res.status(500).send("서버 오류");
        } else {
          res.send(rows);
        }
      }
    );
  });

  router.post("/api/postInsert", decodeToken, (req, res) => {
    const { postContent, user_no, board_info_id } = req.body;
    conn.query(
      "INSERT INTO posts VALUES (NULL, ?, ?, NOW(), NULL, ?, 0, 0)",
      [postContent, user_no, board_info_id],
      (err, result) => {
        if (err) {
          console.error("쿼리 실행 오류:", err);
          res.status(500).send("서버 오류");
        } else {
          res.send({ message: "게시글이 성공적으로 등록되었습니다.", result });
        }
      }
    );
  });

  return router; // 라우터 반환
};
