// server.js
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const mysql = require("mysql");
const fs = require("fs");
const socketIo = require("socket.io");
const setupChatModule = require("./socket");
const path = require("path");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(bodyParser.json());

// DB 연결 설정
const data = fs.readFileSync("./server/database.json");
const conf = JSON.parse(data);

const conn = mysql.createConnection({
    host: conf.host,
    port: conf.port,
    user: conf.user,
    password: conf.password,
    database: conf.database,
});

conn.connect((err) => {
    if (err) {
        console.error("DB 연결 오류:", err);
    } else {
        console.log("DB 연결 성공");
    }
});

// Socket.IO 설정
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// 채팅 모듈 설정
setupChatModule(app, io, conn);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`서버 동작중 ${port}`));

// 라우트 모듈을 가져와서 사용
const authentication = require("./controllers/authentication");
app.use(authentication(conn));

const boardInfoRoutes = require("./controllers/boardInfo");
app.use(boardInfoRoutes(conn));

const UserProfile = require("./controllers/userProfile");
app.use(UserProfile(conn));

const PostRoutes = require("./controllers/post");
app.use(PostRoutes(conn));

// 'images' 디렉토리의 경로를 절대 경로로 설정
app.use("/images", express.static(path.join(__dirname, "images")));
