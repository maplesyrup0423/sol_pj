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

  //댓글 조회 (답글X)
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
  //댓글 입력
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
  //------------------------------------------------------------------
  //댓글 삭제
  router.post("/api/comment/:comment_id/delete", decodeToken(), (req, res) => {
    // 게시글 소프트 삭제 (isDeleted 값을 1로 업데이트)
    const comment_id = req.params.comment_id;
    const query = "UPDATE comments SET isDeleted = 1 WHERE comment_id = ?";
    conn.query(query, [comment_id], (err, rows) => {
      if (err) {
        console.error("쿼리 실행 오류:", err);
        return res.status(500).send("서버 오류");
      }
      res.status(204).send();
    });
  });
  //------------------------------------------------------------------
  //댓글 수정
  router.post(
    "/api/commentUpdate",
    upload.array("images"), // 새로운 이미지 파일들을 업로드 처리
    decodeToken(),
    (req, res) => {
      const { comment_id, postContent, user_no, existingImages } = req.body;
      const updatePostQuery =
        "UPDATE comments SET comment_text = ? WHERE comment_id = ? AND user_no = ?";

      conn.query(
        updatePostQuery,
        [postContent, comment_id, user_no],
        (err, result) => {
          if (err) {
            console.error("Post update query error:", err);
            return res.status(500).send("게시글 수정에 실패했습니다.");
          }

          // 기존 이미지 처리: 삭제되지 않은 기존 이미지만 유지
          const existingImageArray = Array.isArray(existingImages)
            ? existingImages
            : [existingImages]; // 기존 이미지가 배열인지 확인
          // 기존 이미지 중 삭제된 이미지를 DB에서 제거
          const deleteImagesQuery =
            "DELETE FROM comments_files WHERE comment_id = ? AND comments_file_path NOT IN (?)";
          conn.query(
            deleteImagesQuery,
            [comment_id, existingImageArray],
            (err) => {
              if (err) {
                console.error("Existing image deletion error:", err);
                return res.status(500).send("기존 이미지 삭제에 실패했습니다.");
              }

              // 새롭게 추가된 이미지 파일 처리
              if (req.files && req.files.length > 0) {
                const newImageInserts = req.files.map((file) => [
                  comment_id,
                  file.filename,
                ]);

                const insertImagesQuery =
                  "INSERT INTO comments_files (comment_id, comments_file_path) VALUES ?";
                conn.query(insertImagesQuery, [newImageInserts], (err) => {
                  if (err) {
                    console.error("Image insertion error:", err);
                    return res
                      .status(500)
                      .send("새 이미지 추가에 실패했습니다.");
                  }

                  res.send("댓글과 이미지가 성공적으로 수정되었습니다.");
                });
              } else {
                // 이미지가 없는 경우
                res.send("댓글이 성공적으로 수정되었습니다.");
              }
            }
          );
        }
      );
    }
  );
  return router;
};
