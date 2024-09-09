const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");

// Multer 설정

const uploadPath = path.join(__dirname, "../uploads"); // 상대 경로를 사용하여 'uploads' 폴더를 참조합니다.

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // 서버 루트의 uploads 폴더를 참조
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
    console.log("Received request:", req.body);
    const { nickname, introduce, user_no } = req.body;
    const image_url = req.file ? req.file.filename : null;

    const updateProfile = `
    UPDATE UserProfile
    SET nickname = ?, introduce = ?, image_url = ?
    WHERE user_no = '3'
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
  }
);

module.exports = router;
