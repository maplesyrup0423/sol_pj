const express = require("express");
const router = express.Router();

// post DB값 받아오기
//todo 지금은 board_info_id=1인 게시판 정보 받아옴. 추후 게시판별로 받아와야함
module.exports = (conn) => {
  router.get("/post", (req, res) => {
    const board_info_id = 1;
    conn.query(
      "SELECT p.post_id,p.post_text,p.user_no,p.createDate,p.modiDate, p.views," +
        " GROUP_CONCAT(pf.file_path ORDER BY pf.upload_date SEPARATOR ', ') AS file_paths," +
        " u.user_id,up.nickname,up.image_url" +
        " FROM posts p" +
        " LEFT JOIN post_files pf ON p.post_id = pf.post_id" +
        " LEFT JOIN User u ON p.user_no = u.user_no" +
        " LEFT JOIN UserProfile up ON u.user_no = up.user_no" +
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

  return router; // 라우터 반환
};
