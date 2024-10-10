const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");
module.exports = (conn) => {
  //게시글 좋아요 이미 눌렀는지 확인
  router.get(
    "/api/posts/:postId/isLikedByUser/:user_no",
    decodeToken(),
    (req, res) => {
      const { postId, user_no } = req.params;
      const query =
        "SELECT * FROM post_likes WHERE post_id = ? AND user_no = ?";

      conn.query(query, [postId, user_no], (err, result) => {
        if (err) {
          console.error("쿼리 실행 오류:", err);
          res.status(500).send("서버 오류");
        } else {
          // 좋아요가 존재하면 true, 아니면 false 반환
          const isLiked = result.length > 0;
          res.status(200).json({
            liked: isLiked,
          });
        }
      });
    }
  );

  //------------------------------------------------------------------
  //게시글 좋아요 등록
  router.post("/api/posts/:postId/like", decodeToken(), (req, res) => {
    const { postId } = req.params;
    const { user_no } = req.body; // req.body로부터 userId를 받음

    const query = "INSERT INTO post_likes (post_id, user_no) VALUES (?, ?)";

    conn.query(query, [postId, user_no], (err, result) => {
      if (err) {
        console.error("쿼리 실행 오류:", err);
        res.status(500).send("서버 오류");
      } else {
        res.status(200).json({
          message: "좋아요가 성공적으로 추가되었습니다.",
          postId,
          user_no,
        });
      }
    });
  });

  //------------------------------------------------------------------
  //게시글 좋아요 취소
  router.post(
    "/api/posts/:postId/unlike/:user_no",
    decodeToken(),
    (req, res) => {
      const { postId, user_no } = req.params;
      const query = "DELETE FROM post_likes WHERE post_id = ? AND user_no = ?";

      conn.query(query, [postId, user_no], (err, result) => {
        if (err) {
          console.error("쿼리 실행 오류:", err);
          res.status(500).send("서버 오류");
        } else {
          if (result.affectedRows > 0) {
            res.status(200).json({
              message: "좋아요가 성공적으로 취소되었습니다.",
              postId,
              user_no,
            });
          } else {
            res.status(404).json({
              message: "해당 게시물에 대한 좋아요가 존재하지 않습니다.",
            });
          }
        }
      });
    }
  );

  //------------------------------------------------------------------
  //댓글/답글 좋아요 이미 눌렀는지 확인
  router.get(
    "/api/comment/:comment_id/isLikedByUser/:user_no",
    decodeToken(),
    (req, res) => {
      const { comment_id, user_no } = req.params;
      const query =
        "SELECT * FROM comment_likes WHERE comment_id = ? AND user_no = ?";

      conn.query(query, [comment_id, user_no], (err, result) => {
        if (err) {
          console.error("쿼리 실행 오류:", err);
          res.status(500).send("서버 오류");
        } else {
          // 좋아요가 존재하면 true, 아니면 false 반환
          const isLiked = result.length > 0;
          res.status(200).json({
            liked: isLiked,
          });
        }
      });
    }
  );

  //------------------------------------------------------------------
  //게시글 좋아요 등록
  router.post("/api/comment/:comment_id/like", decodeToken(), (req, res) => {
    const { comment_id } = req.params;
    const { user_no } = req.body; // req.body로부터 userId를 받음

    const query =
      "INSERT INTO comment_likes (comment_id, user_no) VALUES (?, ?)";

    conn.query(query, [comment_id, user_no], (err, result) => {
      if (err) {
        console.error("쿼리 실행 오류:", err);
        res.status(500).send("서버 오류");
      } else {
        res.status(200).json({
          message: "좋아요가 성공적으로 추가되었습니다.",
          comment_id,
          user_no,
        });
      }
    });
  });

  //------------------------------------------------------------------
  //게시글 좋아요 취소
  router.post(
    "/api/comment/:comment_id/unlike/:user_no",
    decodeToken(),
    (req, res) => {
      const { comment_id, user_no } = req.params;
      const query =
        "DELETE FROM comment_likes WHERE comment_id = ? AND user_no = ?";

      conn.query(query, [comment_id, user_no], (err, result) => {
        if (err) {
          console.error("쿼리 실행 오류:", err);
          res.status(500).send("서버 오류");
        } else {
          if (result.affectedRows > 0) {
            res.status(200).json({
              message: "좋아요가 성공적으로 취소되었습니다.",
              comment_id,
              user_no,
            });
          } else {
            res.status(404).json({
              message: "해당 게시물에 대한 좋아요가 존재하지 않습니다.",
            });
          }
        }
      });
    }
  );
  return router; // 라우터 반환
};
