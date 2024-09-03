// middleware/decodeToken.js
const jwt = require('jsonwebtoken');

const decodeToken = (conn) => (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.access_secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }

    // 토큰 데이터베이스 검증
    const queryStr = 'SELECT token FROM refreshtokens WHERE user_no = ?';
    conn.query(queryStr, [user.user_no], (err, results) => {
      if (err) {
        console.error('DB 오류:', err);
        return res.status(500).json({ message: '서버 오류' });
      }

      if (results.length === 0 || results[0].token !== token) {
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
      }

      
      next();
    });
  });
};

module.exports = decodeToken;
