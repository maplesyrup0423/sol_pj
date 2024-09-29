const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// 로그인 라우트 설정
module.exports = function (conn) {
    router.post("/login", async (req, res) => {
        try {
            const { username, password } = req.body;

            const query = `SELECT u.user_id, u.status, u.user_no, f.nickname, f.image_url, p.password, f.introduce 
                           FROM user u 
                           JOIN userprofile f ON u.user_no = f.user_no 
                           JOIN password p ON u.user_no = p.user_no
                           WHERE u.user_id = ? AND p.password = ?`;

            conn.query(query, [username, password], (err, results) => {
                if (err) {
                    console.error("사용자 조회 쿼리 오류:", err);
                    return res
                        .status(500)
                        .json({ success: false, message: "서버 오류" });
                }

                console.log("쿼리 결과:", results);

                if (results.length === 0) {
                    // 로그인 실패 로그 기록
                    const logQuery = `INSERT INTO LoginLog (user_id, login_time, login_status) VALUES (?, NOW(), 'FAIL')`;
                    conn.query(logQuery, [username], (logErr) => {
                        if (logErr) {
                            console.error(
                                "로그인 실패 로그 기록 오류:",
                                logErr
                            );
                        }
                    });

                    return res.status(401).json({
                        success: false,
                        message: "아이디 또는 비밀번호가 일치하지 않습니다.",
                    });
                }

                const user = results[0];

                // 휴면 계정 상태 예외 처리 ****************************
                if (user.status === "dormant") {
                    return res.status(403).json({
                        success: false,
                        message:
                            "계정이 휴면 상태입니다. 계정을 활성화하려면 고객 센터에 문의하세요.",
                    });
                }

                const logQuery = `INSERT INTO LoginLog (user_id, login_time, login_status) VALUES (?, NOW(), 'SUCCESS')`;
                conn.query(logQuery, [user.user_id], (logErr) => {
                    if (logErr) {
                        console.error("로그인 성공 로그 기록 오류:", logErr);
                    }
                });

                const accessToken = jwt.sign(
                    { user_id: user.user_id, user_no: user.user_no },
                    process.env.access_secret,
                    { expiresIn: "60m" }
                );

                const checkRefreshTokenQuery =
                    "SELECT token FROM refreshtokens WHERE user_no = ?";
                conn.query(
                    checkRefreshTokenQuery,
                    [user.user_no],
                    (err, tokenResults) => {
                        if (err) {
                            console.error("리프레시 토큰 확인 오류:", err);
                            return res
                                .status(500)
                                .json({ success: false, message: "서버 오류" });
                        }

                        let refreshToken;
                        if (tokenResults.length === 0) {
                            refreshToken = jwt.sign(
                                {
                                    user_id: user.user_id,
                                    user_no: user.user_no,
                                },
                                process.env.refresh_secret,
                                { expiresIn: "30d" }
                            );

                            const saveRefreshTokenQuery =
                                "INSERT INTO refreshtokens (user_no, token) VALUES (?, ?)";
                            conn.query(
                                saveRefreshTokenQuery,
                                [user.user_no, refreshToken],
                                (err, saveResult) => {
                                    if (err) {
                                        console.error(
                                            "리프레시 토큰 저장 오류:",
                                            err
                                        );
                                        return res.status(500).json({
                                            success: false,
                                            message: "서버 오류",
                                        });
                                    }

                                    sendResponse(
                                        res,
                                        user,
                                        accessToken,
                                        refreshToken
                                    );
                                }
                            );
                        } else {
                            refreshToken = tokenResults[0].token;

                            // 로그인 성공 로그 기록

                            sendResponse(res, user, accessToken, refreshToken);
                        }
                    }
                );
            });
        } catch (err) {
            console.error("서버 오류:", err);
            return res
                .status(500)
                .json({ success: false, message: "서버 오류" });
        }
    });

    function sendResponse(res, user, accessToken, refreshToken) {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
            secure: process.env.NODE_ENV === "production", // 프로덕션 환경에서만 true
            sameSite: "strict",
        });

        res.json({
            success: true,
            message: "로그인 성공!",
            user: {
                user_no: user.user_no,
                user_id: user.user_id,
                nickname: user.nickname,
                image_url: user.image_url,
                introduce: user.introduce,
            },
            accessToken,
            redirectUrl: "http://localhost:3000/",
        });
    }

    router.post("/refresh-token", (req, res) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res
                .status(401)
                .json({ success: false, message: "리프레시 토큰이 없습니다." });
        }

        try {
            // 리프레시 토큰 검증
            const decoded = jwt.verify(
                refreshToken,
                process.env.refresh_secret
            );
            const { user_id, user_no } = decoded;

            // 데이터베이스에서 리프레시 토큰이 존재하는지 확인
            const query = "SELECT token FROM refreshtokens WHERE user_no = ?";
            conn.query(query, [user_no], (err, results) => {
                if (err) {
                    console.error("리프레시 토큰 확인 오류:", err);
                    return res
                        .status(500)
                        .json({ success: false, message: "서버 오류" });
                }

                if (results.length === 0 || results[0].token !== refreshToken) {
                    return res.status(401).json({
                        success: false,
                        message: "리프레시 토큰이 유효하지 않습니다.",
                    });
                }

                // 새 액세스 토큰 발급
                const newAccessToken = jwt.sign(
                    { user_id, user_no },
                    process.env.access_secret,
                    { expiresIn: "60m" }
                );

                return res.json({
                    success: true,
                    accessToken: newAccessToken,
                });
            });
        } catch (err) {
            console.error("리프레시 토큰 검증 오류:", err);
            return res.status(403).json({
                success: false,
                message: "리프레시 토큰이 유효하지 않습니다.",
            });
        }
    });

    router.post("/user-info", (req, res) => {
        const token = req.headers.authorization?.split(" ")[1]; // 'Bearer <token>'에서 <token> 추출

        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "토큰이 없습니다." });
        }

        try {
            const decoded = jwt.verify(token, process.env.access_secret);
            const { user_id, user_no } = decoded;

            // 데이터베이스에서 사용자 정보 조회
            const query = `SELECT u.user_id, u.user_no, f.nickname, f.image_url, f.introduce 
                           FROM user u 
                           JOIN userprofile f ON u.user_no = f.user_no 
                           WHERE u.user_no = ?`;
            conn.query(query, [user_no], (err, results) => {
                if (err) {
                    console.error("사용자 조회 오류:", err);
                    return res
                        .status(500)
                        .json({ success: false, message: "서버 오류" });
                }

                if (results.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "사용자를 찾을 수 없습니다.",
                    });
                }

                res.json({
                    success: true,
                    user: results[0],
                });
            });
        } catch (err) {
            console.error("토큰 검증 오류:", err);
            return res
                .status(403)
                .json({ success: false, message: "토큰이 유효하지 않습니다." });
        }
    });

    router.post("/api/logout", (req, res) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(200).json({
                success: true,
                message: "이미 로그아웃 된 상태입니다.",
            });
        }

        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.refresh_secret
            );
            const { user_no } = decoded;

            // 데이터베이스에서 리프레시 토큰 삭제
            const query = "DELETE FROM refreshtokens WHERE user_no = ?";
            conn.query(query, [user_no], (err, results) => {
                if (err) {
                    console.error("리프레시 토큰 삭제 오류:", err);
                    return res
                        .status(500)
                        .json({ success: false, message: "서버 오류" });
                }

                if (results.affectedRows === 0) {
                }

                // 쿠키에서 리프레시 토큰 삭제
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                });

                res.json({ success: true, message: "로그아웃 성공" });
            });
        } catch (err) {
            console.error("리프레시 토큰 검증 오류:", err);
            // 토큰이 유효하지 않아도 쿠키는 삭제
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            res.status(200).json({
                success: true,
                message: "로그아웃 성공 (토큰 만료)",
            });
        }
    });

    return router;
};
