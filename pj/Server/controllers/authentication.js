const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');

// MySQL 연결 설정 (필요 시 수정)
const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// async/await를 사용하여 비동기 처리
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // 유저 정보 및 비밀번호 조회 쿼리
        const query = `SELECT u.user_id, u.user_no, f.nickname, f.image_url, p.password, f.introduce 
                       FROM user u 
                       JOIN userprofile f ON u.user_no = f.user_no 
                       JOIN password p ON u.user_no = p.user_no
                       WHERE u.user_id = ? AND p.password = ?`;

        const [results] = await conn.query(query, [username, password]);
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: "아이디 또는 비밀번호가 일치하지 않습니다." });
        }

        const user = results[0];

        // JWT 액세스 토큰 생성
        const accessToken = jwt.sign(
            { user_id: user.user_id, user_no: user.user_no },
            process.env.access_secret,
            { expiresIn: '60m' } // 액세스 토큰 유효기간 60분
        );

        // 리프레시 토큰 확인 쿼리
        const checkRefreshTokenQuery = "SELECT token FROM refreshTokens WHERE user_no = ?";
        const [tokenResults] = await conn.query(checkRefreshTokenQuery, [user.user_no]);

        let refreshToken;
        if (tokenResults.length === 0) {
            // 리프레시 토큰이 없으면 새로 생성
            refreshToken = jwt.sign(
                { user_id: user.user_id, user_no: user.user_no },
                process.env.refresh_secret,
                { expiresIn: '30d' } // 리프레시 토큰 유효기간 30일
            );

            // 새 리프레시 토큰을 데이터베이스에 저장
            const saveRefreshTokenQuery = "INSERT INTO refreshTokens (user_no, token) VALUES (?, ?)";
            await conn.query(saveRefreshTokenQuery, [user.user_no, refreshToken]);

        } else {
            // 기존 리프레시 토큰 재사용
            refreshToken = tokenResults[0].token;
        }

        // 리프레시 토큰을 HTTP-only 쿠키로 설정
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30일 유효
            secure: process.env.NODE_ENV === 'production', // HTTPS에서만 쿠키 전송
            sameSite: 'strict',
        });

        // 클라이언트에 응답
        return res.json({
            success: true,
            message: "로그인 성공!",
            user: {
                user_id: user.user_id,
                nickname: user.nickname,
                image_url: user.image_url,
                introduce: user.introduce,
            },
            accessToken, // 클라이언트에서 로컬 스토리지에 저장할 액세스 토큰
            redirectUrl: "http://localhost:3000/myProfile",
        });

    } catch (err) {
        console.error("서버 오류:", err);
        return res.status(500).json({ success: false, message: "서버 오류" });
    }
});
