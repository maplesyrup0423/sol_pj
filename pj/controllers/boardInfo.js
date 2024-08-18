const express = require("express");
const router = express.Router();

// DB 연결 객체를 매개변수로 받는 함수로 모듈화
module.exports = (conn) => {
  // 라우트 정의
  router.get("/api/boardInfo", (req, res) => {
    conn.query("SELECT * FROM board_info_table", (err, rows, fields) => {
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
