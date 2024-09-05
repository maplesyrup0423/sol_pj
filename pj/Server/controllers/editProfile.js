const express = require("express");
const router = express.Router();

module.exports = (conn) => {
  router.post("/mypage", async (req, res) => {
    const { nickname, introduce, image_url, user_no } = req.body;

    const updateProfile = `
            UPDATE UserProfile
            SET nickname = ?, introduce = ?, image_url = ?
            WHERE user_no = ?
        `;

    conn.query(
      updateProfile,
      [nickname, introduce, image_url, user_no],
      (err, results) => {
        if (err) {
          console.error("쿼리 오류 : ", err);
          return res.status(500).json({ error: "서버오류" });
        }
        res.status(200).json({ message: "프로필수정 성공!" });
      }
    );
  });

  return router;
};
