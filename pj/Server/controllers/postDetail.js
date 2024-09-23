const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "images", "uploads_feed")); // 업로드할 디렉토리
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // 파일 이름 설정
  },
});
const upload = multer({ storage });

module.exports = (conn) => {
  // 게시물 세부 정보 조회 API
  router.get("/api/postDetail", decodeToken(), (req, res) => {
    let postId = req.query.postId;

    if (!postId) {
      return res.status(400).send("게시물 ID가 필요합니다.");
    }

    // 조회수 증가 쿼리 먼저 실행
    conn.query(
      "UPDATE posts SET views = views + 1 WHERE post_id = ?",
      [postId],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error: "Failed to update views" });
        }

        // 조회수 증가 후 게시물 정보를 가져오는 쿼리 실행
        const query = `
          SELECT u.user_no, p.post_id, p.post_text, p.createDate, p.modiDate, p.views, 
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
          GROUP BY u.user_no, p.post_id, p.post_text, p.createDate, p.modiDate, p.views, u.user_id, up.nickname, up.image_url
        `;

        conn.query(query, [postId], (err, rows) => {
          if (err) {
            console.error("쿼리 실행 오류:", err);
            return res.status(500).send("서버 오류");
          }

          if (rows.length > 0) {
            return res.send(rows[0]); // 게시물 정보를 반환
          } else {
            return res.status(404).send("게시물을 찾을 수 없습니다.");
          }
        });
      }
    );
  });

  //------------------------------------------------------------------

  //댓글 조회
  router.get("/api/postDetailComment", decodeToken(), (req, res) => {
    //const { postId } = req.params.postId;
    let postId = req.query.postId;

    const parentCommentId = req.query.parentCommentId; // 답글

    if (!postId) {
      return res.status(400).send("게시물 ID가 필요합니다.");
    }

    let query = `
select c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
	  c.user_no, c.createDate, c.modiDate, c.isDeleted, count(cl.user_no) as like_count,
    u.nickname, u.image_url,
    GROUP_CONCAT(DISTINCT cf.comments_file_path ORDER BY cf.upload_date SEPARATOR ', ') AS file_paths
    from comments c
    left join comment_likes cl
    on c.comment_id = cl.comment_id
    join UserProfile u
    on u.user_no = c.user_no
    LEFT JOIN comments_files cf ON c.comment_id = cf.comment_id
    WHERE c.post_id=?
    `;

    const params = [postId];

    if (parentCommentId) {
      query += ` AND c.parent_comment_id = ?`;
      params.push(parentCommentId);
    } else {
      query += ` AND c.parent_comment_id IS NULL`;
    }

    query += ` GROUP BY c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
      c.user_no, c.createDate, c.modiDate, c.isDeleted, u.nickname, u.image_url`;

    conn.query(query, [postId], (err, rows, fields) => {
      if (err) {
        console.error("쿼리 실행 오류:", err);
        res.status(500).send("서버 오류");
      } else {
        res.send(rows);
      }
    });
  });
  //------------------------------------------------------------------
  router.post(
    "/api/commentInsert",
    upload.array("images"),
    decodeToken(),
    (req, res) => {
      const { post_id, parent_comment_id, postContent, user_no } = req.body;
      conn.query(
        "INSERT INTO comments(post_id,parent_comment_id,comment_text,user_no) VALUES (?,?,?,?)",
        [post_id, parent_comment_id, postContent, user_no],
        (err, result) => {
          if (err) {
            console.error("쿼리 실행 오류:", err);
            res.status(500).send("서버 오류");
          }
          const post_id = result.insertId; // 삽입된 글의 ID

          // 이미지 삽입
          if (req.files && req.files.length > 0) {
            const imageInserts = req.files.map((file) => [
              post_id,
              file.filename,
            ]);

            const sql =
              "INSERT INTO comments_files (comment_id, comments_file_path) VALUES ?";
            conn.query(sql, [imageInserts], (err) => {
              if (err) {
                console.error("Image Insertion Error:", err);
                return res.status(500).send("Error inserting images");
              }
              res.send("comments and images successfully inserted");
            });
          } else {
            res.send("comments successfully inserted without images");
          }
        }
      );
    }
  );

  return router;
};
