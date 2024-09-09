const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");

module.exports = (conn) => {
    router.get("/notification", async (req, res) => {
        // 응답 헤더 설정
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        // // 5초마다 주기적으로 데이터를 클라이언트로 전송
        // setInterval(() => {
        //     const message = {
        //         content: "새로운 알림입니다!",
        //         id: new Date().getTime(),
        //     };
        //     res.write(`data: ${JSON.stringify(message)}\n\n`);
        // }, 5000);
    });

    return router;
};
