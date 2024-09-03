const express = require("express");
const router = express.Router();

// 로그인한 유저의 user_no을 이용해서 UserProfile 테이블 정보 가져오기
//! 현재 로그인한 유저 판별이 불가능하기에 user_no이 1인 유저 정보를 가져와서 테스트 함
module.exports = (conn) => {
  router.get("/userProfileInfo", (req, res) => {
    const userNo = 1;
    conn.query(
      "select * from user u join userprofile up on u.user_no=up.user_no where u.user_no=?",
      [userNo],
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

  //유저 정보 update문

  return router; // 라우터 반환
};

//todo "/userProfileInfo/:user_no"  const userNo = req.params.user_no; 로 바꾸면 /api/userProfileInfo/1와 같이 요청할 수 있습니다.
//todo 컨트롤러 파일 좀 적게 쓰는 방법 구상하기 =>Knex 사용
