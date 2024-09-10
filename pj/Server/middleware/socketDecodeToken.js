const jwt = require("jsonwebtoken");
require("dotenv").config();

const decodeSocketToken = (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error("토큰이 없습니다."));
    }

    jwt.verify(token, process.env.access_secret, (err, user) => {
        if (err) {
            return next(new Error("유효하지 않은 토큰입니다."));
        }

        // 토큰에서 user_no를 socket 객체에 추가
        socket.user_no = user.user_no;

        // 다음 미들웨어 또는 연결을 허용
        next();
    });
};

module.exports = decodeSocketToken;
