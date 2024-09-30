const jwt = require("jsonwebtoken");
require("dotenv").config();

const decodeToken = () => (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.log("Authorization 헤더가 없습니다.");
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.log("토큰이 제공되지 않았습니다.");
    return res.status(401).json({ message: "토큰이 제공되지 않았습니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.access_secret);

    // 토큰에서 user_no를 req 객체에 추가
    req.user_no = decoded.user_no;

    // 다음 미들웨어 또는 라우트로 넘어감
    next();
  } catch (error) {
    console.error("토큰 검증 오류:", error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "토큰이 만료되었습니다." });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

module.exports = decodeToken;