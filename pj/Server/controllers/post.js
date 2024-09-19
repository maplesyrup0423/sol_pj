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
  // post DB값 받아오기
  router.get("/api/post", decodeToken(), (req, res) => {
    const board_info_id = req.query.board_info_id; // 쿼리 파라미터로 게시판 ID 받아오기
    const orderBy = req.query.orderBy || "date";

    //console.log("Received orderBy:", orderBy);

    // 게시판 ID가 제공되지 않은 경우 처리
    if (!board_info_id) {
      return res.status(400).send("게시판 ID가 필요합니다.");
    }

    let orderClause;
    let period;
    if (orderBy === "pop") {
      orderClause = "ORDER BY like_count DESC, p.views DESC"; // 인기순 (좋아요 수 -> 조회수 순)
      period =
        "AND p.createDate BETWEEN DATE_ADD(NOW(), INTERVAL -1 WEEK ) AND NOW()"; //불러오는 날짜를 현재로부터 7일로
    } else {
      orderClause = "ORDER BY p.createDate DESC"; // 최신순
      period = "";
    }

    const query = `SELECT p.board_info_id, p.post_id, p.post_text, p.user_no, p.createDate, p.modiDate, p.views,
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
          WHERE p.board_info_id = ? AND p.isDeleted = 0
          ${period}
          GROUP BY p.post_id, p.post_text, p.user_no, p.createDate, p.modiDate, p.views, u.user_id, up.nickname, up.image_url
          ${orderClause}`;

    // 로그로 쿼리와 정렬 조건을 출력하여 디버깅
    //console.log('Executing query:', query);

    conn.query(query, [board_info_id], (err, rows, fields) => {
      if (err) {
        console.error("쿼리 실행 오류:", err);
        res.status(500).send("서버 오류");
      } else {
        res.send(rows);
      }
    });
  });

  //------------------------------------------------------------------
  // 게시글 입력+사진
  router.post(
    "/api/postInsert",
    upload.array("images"),
    decodeToken(),
    (req, res) => {
      const { postContent, user_no, board_info_id } = req.body;
      conn.query(
        "INSERT INTO posts (post_text, user_no, board_info_id) VALUES (?, ?, ?)",
        [postContent, user_no, board_info_id],
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

            const sql = "INSERT INTO post_files (post_id, file_path) VALUES ?";
            conn.query(sql, [imageInserts], (err) => {
              if (err) {
                console.error("Image Insertion Error:", err);
                return res.status(500).send("Error inserting images");
              }
              res.send("Post and images successfully inserted");
            });
          } else {
            res.send("Post successfully inserted without images");
          }
        }
      );
    }
  );

  //------------------------------------------------------------------
  //게시글 삭제
  router.post("/api/posts/:postId/delete", decodeToken(), (req, res) => {
    // 게시글 소프트 삭제 (isDeleted 값을 1로 업데이트)
    const postId = req.params.postId;
    const query = "UPDATE posts SET isDeleted = 1 WHERE post_id = ?";
    conn.query(query, [postId], (err, rows) => {
      if (err) {
        console.error("쿼리 실행 오류:", err);
        return res.status(500).send("서버 오류");
      }
      res.status(204).send();
    });
  });

  //------------------------------------------------------------------
  //게시글 수정
  router.post(
    "/api/postUpdate",
    upload.array("images"), // 새로운 이미지 파일들을 업로드 처리
    decodeToken(),
    (req, res) => {
      const { post_id, postContent, user_no, existingImages } = req.body;

      // 게시글 내용 수정
      const updatePostQuery =
        "UPDATE posts SET post_text = ?, modiDate = NOW() WHERE post_id = ? AND user_no = ?";

      conn.query(
        updatePostQuery,
        [postContent, post_id, user_no],
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
            "DELETE FROM post_files WHERE post_id = ? AND file_path NOT IN (?)";
          conn.query(
            deleteImagesQuery,
            [post_id, existingImageArray],
            (err) => {
              if (err) {
                console.error("Existing image deletion error:", err);
                return res.status(500).send("기존 이미지 삭제에 실패했습니다.");
              }

              // 새롭게 추가된 이미지 파일 처리
              if (req.files && req.files.length > 0) {
                const newImageInserts = req.files.map((file) => [
                  post_id,
                  file.filename,
                ]);

                const insertImagesQuery =
                  "INSERT INTO post_files (post_id, file_path) VALUES ?";
                conn.query(insertImagesQuery, [newImageInserts], (err) => {
                  if (err) {
                    console.error("Image insertion error:", err);
                    return res
                      .status(500)
                      .send("새 이미지 추가에 실패했습니다.");
                  }

                  res.send("게시글과 이미지가 성공적으로 수정되었습니다.");
                });
              } else {
                // 이미지가 없는 경우
                res.send("게시글이 성공적으로 수정되었습니다.");
              }
            }
          );
        }
      );
    }
  );
  return router; // 라우터 반환
};
