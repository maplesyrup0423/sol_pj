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

//로그인 시도하면 불러오고 싶은 함수. 근데 여기 적어도 작동을 안하는거 같음
app.post("/myProfile", (req, res) => {
  //요청시 보내준 유저 정보
  const { username, password } = req.body;
  console.log(req.body);
  // user 테이블의 데이터를 가져오는 쿼리
  const query = "SELECT * FROM user";

  conn.query(query, (err, results, fields) => {
    if (err) {
      console.error("쿼리 실행 오류:", err);
    } else {
      console.log("user 테이블 데이터:", results);
    }
  });

  // 로그인 로직 처리 후 응답
  if (username === "임요한" && password === "1234") {
    res.json({ success: true, message: "로그인 성공!" });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
});

// boardInfo 라우트 모듈을 가져와서 사용
const boardInfoRoutes = require("./controllers/boardInfo");
app.use(boardInfoRoutes(conn));

// myInfo 라우트 모듈을 가져와서 사용
const MyInfoRoutes = require("./controllers/myInfo");
app.use(MyInfoRoutes(conn));

// post 라우트 모듈을 가져와서 사용
const PostRoutes = require("./controllers/post");
app.use(PostRoutes(conn));

//images폴더를 정적 파일 제공으로 지정
app.use("/images", express.static("./images"));
