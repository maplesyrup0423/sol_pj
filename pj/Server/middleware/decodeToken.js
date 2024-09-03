const jwt = require('jsonwebtoken');
require("dotenv").config();

const decodeToken = () => (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.access_secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    // 다음 미들웨어 또는 라우트로 넘어감
    next();
  });
};

module.exports = decodeToken;
