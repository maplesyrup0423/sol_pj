const express = require("express");
const router = express.Router();

module.exports = (conn) => {
    router.post("/signup", async (req, res) => {
        const { userId, password, email } = req.body;
        console.log("서버 진입 계정정보 :  ", userId, password, email);
        // const signupQuery = "";
        res.json({ userId: userId });
        // res.send(userId);
    });

    return router;
};
