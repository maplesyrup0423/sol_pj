// decodeToken.js
const jwt = require('jsonwebtoken');

// 토큰을 디코딩하고, 사용자를 인증하는 미들웨어
const decodeToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }

  const token = authHeader.split(' ')[1]; // 'Bearer ' 부분을 제거하고 토큰만 추출

  jwt.verify(token, process.env.access_secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    req.user = user; // 디코딩된 사용자 정보를 req.user에 저장
    next(); // 다음 미들웨어 또는 라우트 핸들러로 이동
  });
};

module.exports = decodeToken;
