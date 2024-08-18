const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const mysql = require("mysql");
const fs = require("fs");
const socketIo = require("socket.io");
const setupChatModule = require("./socket");

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
const data = fs.readFileSync("./database.json");
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

// 채팅 모듈 설정 (Socket.IO 이벤트 및 채팅 관련 API 엔드포인트)
setupChatModule(app, io, conn);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`서버 동작중 ${port}`));

module.exports = app;

// boardInfo 라우트 모듈을 가져와서 사용
const boardInfoRoutes = require("./boardInfo");
app.use(boardInfoRoutes(conn));
