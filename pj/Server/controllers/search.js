const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");


module.exports = (conn) => {
  // post DB값 받아오기
  router.get("/api/search/:searchKeyword", decodeToken(), (req, res) => {
    const searchKeyword = req.params.searchKeyword;

    const query = "";

    conn.query(query, [board_info_id, limit, offset], (err, rows, fields) => {
      if (err) {
        console.error("쿼리 실행 오류:", err);
        res.status(500).send("서버 오류");
      } else {
        res.send(rows);
      }
    });
  });

  return router;
};