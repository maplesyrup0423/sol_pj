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

// 채팅 모듈 설정 (Socket.IO 이벤트 및 채팅 관련 API 엔드포인트)
setupChatModule(app, io, conn);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`서버 동작중 ${port}`));

module.exports = app;

//로그인 시도하면 불러오고 싶은 함수.
app.post("/login", (req, res) => {
  //요청시 보내준 유저 정보
  const { username, password } = req.body;
  // user 테이블의 데이터를 가져오는 쿼리
  const query = `SELECT u.user_id, f.nickname, f.image_url, p.password, f.introduce 
        FROM user u 
        JOIN userprofile f ON u.user_no = f.user_no 
        JOIN password p ON u.user_no = p.user_no
        WHERE u.user_id = ? AND p.password = ?`;

  conn.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("쿼리 실행 오류:", err);
    } else if (results.length > 0) {
      console.log("로그인 성공 : ", results[0].user_id);
      // 로그인 성공
      res.json({
        success: true,
        message: "로그인 성공!",
        user: {
          user_id: results[0].user_id,
          nickname: results[0].nickname,
          image_url: results[0].image_url,
          introduce: results[0].introduce,
        },
        redirectUrl: "http://localhost:3000/myProfile",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "아이디, 비밀번호 오류! 설정해둔 아이디랑 비번 확인햇!",
      });
    }
  });
});

// 라우트 모듈을 가져와서 사용
const boardInfoRoutes = require("./controllers/boardInfo");
app.use(boardInfoRoutes(conn));
const UserProfile = require("./controllers/userProfile");
app.use(UserProfile(conn));
const PostRoutes = require("./controllers/post");
app.use(PostRoutes(conn));

//images폴더를 정적 파일 제공으로 지정
app.use("/images", express.static("./images"));
