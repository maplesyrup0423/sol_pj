const express = require("express");
const router = express.Router();

module.exports = (conn) => {
    router.post("/signup", async (req, res) => {
        const { userId, password, email } = req.body;
        const nickname = req.body.nickname || null;
        const imageUrl = req.body.imageUrl || null;
        const introduce = req.body.introduce || null;
        const gender = req.body.gender || null;
        const phone = req.body.phone || null;
        const birthdate = req.body.birthdate || null;
        const address = req.body.address || null;
        const salt = req.body.salt || null;

        console.log("서버 진입 계정정보 :  ", userId, password, email);

        // 중복된 user_id 확인 쿼리
        const checkUserIdQuery = `SELECT COUNT(*) AS count FROM User WHERE user_id = ?`;

        // 중복된 email 확인 쿼리
        const checkEmailQuery = `SELECT COUNT(*) AS count FROM Authentic WHERE email = ?`;

        // 먼저 user_id 중복 체크
        conn.query(checkUserIdQuery, [userId], (err, userIdResult) => {
            if (err) {
                console.error("user_id 중복 확인 중 오류 발생: ", err);
                return res
                    .status(500)
                    .json({ error: "user_id 중복 확인 중 오류 발생" });
            }

            // user_id 중복 확인
            if (userIdResult[0].count > 0) {
                return res
                    .status(400)
                    .json({ error: "이미 존재하는 사용자 ID입니다." });
            }

            // user_id 중복이 없을 경우, email 중복 체크
            conn.query(checkEmailQuery, [email], (err, emailResult) => {
                if (err) {
                    console.error("email 중복 확인 중 오류 발생: ", err);
                    return res
                        .status(500)
                        .json({ error: "email 중복 확인 중 오류 발생" });
                }

                // email 중복 확인
                if (emailResult[0].count > 0) {
                    return res
                        .status(400)
                        .json({ error: "이미 존재하는 이메일입니다." });
                }

                // 중복이 없을 경우, 프로시저 호출
                const signupQuery = `
                    CALL RegisterUser(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                conn.query(
                    signupQuery,
                    [
                        userId,
                        nickname,
                        imageUrl,
                        introduce,
                        gender,
                        phone,
                        email,
                        birthdate,
                        address,
                        password,
                        salt,
                    ],
                    (err, results) => {
                        if (err) {
                            console.error("회원가입 중 오류 발생: ", err);
                            return res
                                .status(500)
                                .json({ error: "회원가입 실패" });
                        }

                        // 성공적으로 회원가입이 완료된 경우
                        res.json({ message: "회원가입 성공", userId: userId });
                    }
                );
            });
        });
    });

    return router;
};
