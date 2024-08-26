const express = require("express");
const router = express.Router();

// post DB값 받아오기
//todo 지금은 board_info_id=1인 게시판 정보 받아옴. 추후 게시판별로 받아와야함
module.exports = (conn) => {
  router.get("/post", (req, res) => {
    const board_info_id = 1;
    conn.query(
      "select p.post_id, p.post_text, p.user_no, p.createDate, " +
        "p.modiDate, p.isDeleted, p.views, up.nickname, up.image_url, u.user_id from user u " +
        "join userprofile up on u.user_no=up.user_no " +
        "join posts p on p.user_no=u.user_no " +
        "where p.board_info_id=1 and  p.isDeleted=0 " +
        "ORDER BY p.createDate DESC; ",
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
