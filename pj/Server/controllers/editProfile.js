const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");

module.exports = function (conn) {
  // Multer 설정
  const uploadPath = path.join(__dirname, "../images/uploads");

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage });

  // 프로필 수정 라우트
  router.post(
    "/mypage",
    decodeToken(),
    upload.single("image"),
    async (req, res) => {
      const { nickname, introduce } = req.body;
      const user_no = req.user_no; // user_no를 req에서 가져옵니다.

      // 1. 기존 프로필 정보 조회
      const getCurrentProfile = `
        SELECT image_url
        FROM UserProfile
        WHERE user_no = ?
      `;

      conn.query(getCurrentProfile, [user_no], (err, results) => {
        if (err) {
          console.error("쿼리 오류 : ", err);
          return res.status(500).json({ error: "서버 오류" });
        }

        const currentImageUrl = results[0]?.image_url || null;
        const newImageUrl = req.file ? req.file.filename : currentImageUrl;

        // 2. 프로필 정보 업데이트
        const updateProfile = `
          UPDATE UserProfile
          SET nickname = ?,
              introduce = ?,
              image_url = ?
          WHERE user_no = ?
        `;

        conn.query(
          updateProfile,
          [nickname, introduce, newImageUrl, user_no],
          (err) => {
            if (err) {
              console.error("쿼리 오류 : ", err);
              return res.status(500).json({ error: "서버 오류" });
            }
            res.status(200).json({ message: "프로필 수정 성공!" });
          }
        );
      });
    }
  );

  return router;
};
