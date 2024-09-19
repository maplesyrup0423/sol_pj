const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");

module.exports = (conn) => {
    router.get("/notifications", async (req, res) => {
        const { user_no } = req.query;
        conn.query(
            "SELECT * FROM Notifications WHERE user_no = ?",
            [user_no],
            (err, result) => {
                if (err) {
                    console.log("알림 조회 중 오류 발생");
                    res.status(500).json({
                        success: false,
                        message: "서버 오류",
                    });
                } else {
                    res.json({ success: true, notifications: result });
                }
            }
        );
    });

    return router;
};
