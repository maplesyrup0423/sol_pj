const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');



// 로그인 라우트 설정
module.exports = function(conn) {
    router.post('/login', async (req, res) => {
        console.log("로그인 요청 받음:", req.body);
        try {
            const { username, password } = req.body;
    
            console.log("사용자 조회 쿼리 실행");
            const query = `SELECT u.user_id, u.user_no, f.nickname, f.image_url, p.password, f.introduce 
                           FROM user u 
                           JOIN userprofile f ON u.user_no = f.user_no 
                           JOIN password p ON u.user_no = p.user_no
                           WHERE u.user_id = ? AND p.password = ?`;
    
            conn.query(query, [username, password], (err, results) => {
                if (err) {
                    console.error("사용자 조회 쿼리 오류:", err);
                    return res.status(500).json({ success: false, message: "서버 오류" });
                }
    
                console.log("쿼리 결과:", results);
    
                if (results.length === 0) {
                    console.log("사용자 not found");
                    return res.status(401).json({ success: false, message: "아이디 또는 비밀번호가 일치하지 않습니다." });
                }
    
                const user = results[0];
                console.log("사용자 found:", user.user_id);
    
                const accessToken = jwt.sign(
                    { user_id: user.user_id, user_no: user.user_no },
                    process.env.access_secret,
                    { expiresIn: '60m' }
                );
                console.log("액세스 토큰 생성됨");
    
                console.log("리프레시 토큰 확인 시작");
                const checkRefreshTokenQuery = "SELECT token FROM refreshtokens WHERE user_no = ?";
                conn.query(checkRefreshTokenQuery, [user.user_no], (err, tokenResults) => {
                    if (err) {
                        console.error("리프레시 토큰 확인 오류:", err);
                        return res.status(500).json({ success: false, message: "서버 오류" });
                    }
    
                    console.log("리프레시 토큰 확인 결과:", tokenResults);
    
                    let refreshToken;
                    if (tokenResults.length === 0) {
                        console.log("새 리프레시 토큰 생성");
                        refreshToken = jwt.sign(
                            { user_id: user.user_id, user_no: user.user_no },
                            process.env.refresh_secret,
                            { expiresIn: '30d' }
                        );
    
                        console.log("리프레시 토큰 DB 저장 시도");
                        const saveRefreshTokenQuery = "INSERT INTO refreshtokens (user_no, token) VALUES (?, ?)";
                        conn.query(saveRefreshTokenQuery, [user.user_no, refreshToken], (err, saveResult) => {
                            if (err) {
                                console.error("리프레시 토큰 저장 오류:", err);
                                return res.status(500).json({ success: false, message: "서버 오류" });
                            }
                            console.log("리프레시 토큰 저장 결과:", saveResult);
                            sendResponse(res, user, accessToken, refreshToken);
                        });
                    } else {
                        console.log("기존 리프레시 토큰 사용");
                        refreshToken = tokenResults[0].token;
                        sendResponse(res, user, accessToken, refreshToken);
                    }
                });
            });
        } catch (err) {
            console.error("서버 오류:", err);
            return res.status(500).json({ success: false, message: "서버 오류" });
        }
    });
    
    function sendResponse(res, user, accessToken, refreshToken) {
        console.log("응답 전송 시작");
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
    
        console.log("응답 데이터:", {
            success: true,
            message: "로그인 성공!",
            user: {
                user_id: user.user_id,
                nickname: user.nickname,
                image_url: user.image_url,
                introduce: user.introduce,
            },
            accessToken,
            redirectUrl: "http://localhost:3000/",
        });
    
        res.json({
            success: true,
            message: "로그인 성공!",
            user: {
                user_id: user.user_id,
                nickname: user.nickname,
                image_url: user.image_url,
                introduce: user.introduce,
            },
            accessToken,
            redirectUrl: "http://localhost:3000/",
        });
    }
    return router;
};
