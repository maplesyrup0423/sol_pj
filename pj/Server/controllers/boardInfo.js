const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");

// DB 연결 객체를 매개변수로 받는 함수로 모듈화
module.exports = (conn) => {
  // 게시판 정보 조회
  router.get("/api/boardInfo", decodeToken(), (req, res) => {
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

  // ---------------------------------------------------------------------------

  // 사용자 게시판 정보 조회
  router.get("/api/boardInfoUser", decodeToken(), (req, res) => {
    const query = `select ub.board_info_id, bi.board_info_name, bi.board_img  
      from userboard ub
      LEFT JOIN board_info_table bi on bi.board_info_id=ub.board_info_id
      where ub.user_no=?`;
    const user_no = req.query.user_no;

    conn.query(query, [user_no], (err, rows, fields) => {
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

  // ---------------------------------------------------------------------------

  // 사용자 게시판 정보 업데이트
  router.post("/api/updateUserBoard", decodeToken(), (req, res) => {
    const { user_no, board_ids } = req.body;

    // 프로시저 호출
    conn.query(
      "CALL UpdateUserBoard(?, ?)",
      [user_no, JSON.stringify(board_ids)],
      (err, results) => {
        if (err) {
          console.error("사용자 게시판 정보 업데이트 오류:", err.message);
          res.status(500).json({
            error: "사용자 게시판 정보를 업데이트하는 중 오류가 발생했습니다.",
          });
        } else {
          res.status(200).json({
            message: "사용자 게시판 정보가 성공적으로 업데이트되었습니다.",
          });
        }
      }
    );
  });

  // ---------------------------------------------------------------------------

  // 게시판 이미지 정보 조회
  router.get("/api/board_img/:boardId", decodeToken(), (req, res) => {
    const { boardId } = req.params;
    conn.query(
      "SELECT board_img FROM board_info_table WHERE board_info_id = ?",
      [boardId],
      (err, rows, fields) => {
        if (err) {
          console.error("쿼리 실행 오류:", err);
          res.status(500).send("서버 오류");
        } else {
          if (rows.length > 0) {
            const board_img = rows[0].board_img
              ? `${process.env.BASE_URL}/images/board_img/${rows[0].board_img}`
              : null;
            res.send({ board_img });
          } else {
            // 이미지가 없을 때 null 값을 반환합니다.
            res.send({ board_img: null });
          }
        }
      }
    );
  });
  return router; // 라우터 반환
};
