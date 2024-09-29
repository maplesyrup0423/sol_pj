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

    return router;
};
