const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");
module.exports = (conn) => {
  //북마크 눌린상태인지 확인
  router.get(
    "/api/posts/:postId/isBookmarkByUser/:user_no",
    decodeToken(),
    (req, res) => {
      const { postId, user_no } = req.params;
      const query = "SELECT * FROM bookmarks WHERE post_id = ? AND user_no = ?";

      conn.query(query, [postId, user_no], (err, result) => {
        if (err) {
          console.error("쿼리 실행 오류:", err);
          res.status(500).send("서버 오류");
        } else {
          // 북마크가 존재하면 true, 아니면 false 반환
          const isBookmark = result.length > 0;
          res.status(200).json({
            bookmark: isBookmark,
          });
        }
      });
    }
  );

  //------------------------------------------------------------------
  //북마크 등록
  router.post("/api/posts/:postId/bookmark", decodeToken(), (req, res) => {
    const { postId } = req.params;
    const { user_no } = req.body;

    const query = "INSERT INTO bookmarks (post_id, user_no) VALUES (?, ?)";

    conn.query(query, [postId, user_no], (err, result) => {
      if (err) {
        console.error("쿼리 실행 오류:", err);
        res.status(500).send("서버 오류");
      } else {
        res.status(200).json({
          message: "북마크가 성공적으로 추가되었습니다.",
          postId,
          user_no,
        });
      }
    });
  });

  //------------------------------------------------------------------
  //북마크 삭제
  router.post(
    "/api/posts/:postId/unBookmark/:user_no",
    decodeToken(),
    (req, res) => {
      const { postId, user_no } = req.params;
      const query = "DELETE FROM bookmarks WHERE post_id = ? AND user_no = ?";

      conn.query(query, [postId, user_no], (err, result) => {
        if (err) {
          console.error("쿼리 실행 오류:", err);
          res.status(500).send("서버 오류");
        } else {
          if (result.affectedRows > 0) {
            res.status(200).json({
              message: "북마크가 성공적으로 취소되었습니다.",
              postId,
              user_no,
            });
          } else {
            res.status(404).json({
              message: "해당 게시물에 대한 북마크가 존재하지 않습니다.",
            });
          }
        }
      });
    }
  );
  //------------------------------------------------------------------
  // 북마크 불러오기
  router.get("/api/bookmark", decodeToken(), (req, res) => {
    const user_no = req.query.user_no;
    const page = parseInt(req.query.page) || 1; // 요청받은 페이지, 기본값 1
    const limit = parseInt(req.query.limit) || 10; // 한 페이지당 출력할 데이터 수, 기본값 10
    const offset = (page - 1) * limit;

    const query = `SELECT u.user_no, p.post_id, p.post_text, p.createDate, p.modiDate, p.views, 
      u.user_id, up.nickname, up.image_url,p.board_info_id,
      GROUP_CONCAT(DISTINCT pf.file_path ORDER BY pf.upload_date SEPARATOR ', ') AS file_paths,
      COUNT(DISTINCT l.p_like_id) AS like_count,
      COUNT(DISTINCT c.comment_id) AS comment_count
      FROM posts p
      LEFT JOIN post_files pf ON p.post_id = pf.post_id
      LEFT JOIN User u ON p.user_no = u.user_no
      LEFT JOIN bookmarks bk ON p.post_id = bk.post_id
      LEFT JOIN UserProfile up ON u.user_no = up.user_no
      LEFT JOIN post_likes l ON p.post_id = l.post_id
      LEFT JOIN comments c ON p.post_id = c.post_id
      WHERE bk.user_no = ? AND p.isDeleted = 0
      GROUP BY u.user_no, p.post_id, p.post_text, p.createDate, p.modiDate, p.views, u.user_id, up.nickname, up.image_url, p.board_info_id
      ORDER BY bk.createDate DESC
      LIMIT ? OFFSET ?`;

    conn.query(query, [user_no, limit, offset], (err, rows, fields) => {
      if (err) {
        console.error("쿼리 실행 오류:", err);
        res.status(500).send("서버 오류");
      } else {
        res.send(rows);
      }
    });
  });

  return router; // 라우터 반환
};
