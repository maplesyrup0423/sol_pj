const express = require("express");
const router = express.Router(); // 중복 선언 제거

module.exports = (conn) => {
    router.post("/deactivate", async (req, res) => {
        console.log("서버 비활성화 진입 : ", req.body);
        const { userInfo } = req.body;
        const user_no = userInfo.user_no;

        conn.query(
            "INSERT INTO withdrawalUserlog (ci, wu_status_code, wu_reason, wu_date, wu_id) VALUES (?, 1, '비활성화 요청', NOW(), ?)",
            [userInfo.user_id, userInfo.user_id],
            (err, result) => {
                if (err) {
                    console.log("비활성화 로그 처리 중 에러 발생 ");
                } else {
                    conn.query(
                        "UPDATE User SET status = ? WHERE user_no = ?",
                        ["dormant", user_no],
                        (error, results) => {
                            if (error)
                                return res
                                    .status(500)
                                    .send("Error updating user status");
                            res.status(200).send(
                                "User status updated to dormant"
                            );
                        }
                    );
                }
            }
        );
    });

    router.post("/recover-account", (req, res) => {
        const { user_id } = req.body;

        const query = `SELECT user_no FROM user WHERE user_id = ? AND status = 'dormant'`;
        conn.query(query, [user_id], (err, results) => {
            if (err) {
                console.error("계정 조회 오류:", err);
                return res.status(500).json({ message: "서버 오류" });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "해당 이메일의 휴면 계정을 찾을 수 없습니다.",
                });
            }

            const user_no = results[0].user_no;

            const updateStatusQuery = `UPDATE user SET status = 'active' WHERE user_no = ?`;
            conn.query(updateStatusQuery, [user_no], (err) => {
                if (err) {
                    console.error("계정 활성화 오류:", err);
                    return res.status(500).json({ message: "서버 오류" });
                }

                return res
                    .status(200)
                    .json({ message: "계정이 성공적으로 복구되었습니다." });
            });
        });
    });

    // Express.js에서 비밀번호 검증 API 예시
    router.post("/deactivateCheckPassword", async (req, res) => {
        const { user_id, password } = req.body;

        // User 테이블에서 user_no 가져오기
        const query = `
  SELECT u.user_no, p.password 
  FROM User u 
  JOIN Password p ON u.user_no = p.user_no 
  WHERE u.user_id = ?
`;
        conn.query(query, [user_id], async (err, results) => {
            if (err) {
                console.error("비밀번호 확인 오류:", err);
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

            const { password: resultPassword } = results[0];

            if (resultPassword === password) {
                return res.status(200).json({ success: true });
            } else {
                return res.status(401).json({
                    success: false,
                    message: "비밀번호가 일치하지 않습니다.",
                });
            }
            // // 저장된 해시된 비밀번호와 입력된 비밀번호를 비교
            // const inputPasswordHash = hashPassword(password, salt); // 비밀번호 해시 함수 필요
            // if (inputPasswordHash === hashedPassword) {
            //     return res.status(200).json({ success: true });
            // } else {
            //     return res.status(401).json({
            //         success: false,
            //         message: "비밀번호가 일치하지 않습니다.",
            //     });
            // }
        });
    });

    return router;
};
