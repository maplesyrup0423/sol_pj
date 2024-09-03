const express = require("express");
const router = express.Router();
const decodeToken = require("./decodeToken");

// DB 연결 객체를 매개변수로 받는 함수로 모듈화
module.exports = (conn) => {
  router.get("/api/boardInfo", decodeToken, (req, res) => {
    conn.query("SELECT * FROM board_info_table", (err, rows, fields) => {
      if (err) {
        console.error("쿼리 실행 오류:", err);
        res.status(500).send("서버 오류");
      } else {
        // 환경 변수에서 BASE_URL을 읽어옵니다.
        const baseURL = `${process.env.BASE_URL}/images/board_img/`;

        // 각 게시판 정보의 board_img 필드에 baseURL을 붙입니다.
        const modifiedRows = rows.map((row) => ({
          ...row,
          board_img: row.board_img ? `${baseURL}${row.board_img}` : null,
        }));

        res.send(modifiedRows);
      }
    });
  });

  return router; // 라우터 반환
};
