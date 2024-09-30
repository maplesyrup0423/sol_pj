// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
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

app.get("/", (req, res) => {
    res.send("서버가 정상적으로 실행되고 있습니다.");
});

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(bodyParser.json());
app.use(cookieParser());

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

// 'images' 디렉토리의 경로를 절대 경로로 설정
app.use("/images", express.static(path.join(__dirname, "images")));

// 라우트 모듈을 가져와서 사용
const authenticationRoutes = require("./controllers/authentication");
app.use(authenticationRoutes(conn));

const boardInfoRoutes = require("./controllers/boardInfo");
app.use(boardInfoRoutes(conn));

const PostRoutes = require("./controllers/post");
app.use(PostRoutes(conn));

const PostDetailRoutes = require("./controllers/postDetail");
app.use(PostDetailRoutes(conn));

const PostLikeRoutes = require("./controllers/PostLike");
app.use(PostLikeRoutes(conn));

const PostBookmarkRoutes = require("./controllers/postBookmark");
app.use(PostBookmarkRoutes(conn));

//회원가입 라우터
const signupRoutes = require("./controllers/signup");
app.use(signupRoutes(conn));
//알림 기능 라우터
const notificationRoutes = require("./controllers/notification");
app.use(notificationRoutes(conn));
//팔로우 관리 라우터
const followersRoutes = require("./controllers/followers");
app.use(followersRoutes(conn));

const chatServiceRoutes = require("./controllers/chatService");
app.use(chatServiceRoutes(conn));

//프로필변경 라우터
const editProfileRoutes = require("./controllers/editProfile");
app.use(editProfileRoutes(conn));

const userPostRoutes = require("./controllers/userPost");
app.use(userPostRoutes(conn));

const commentRoutes = require("./controllers/comments");
app.use(commentRoutes(conn));

const searchRoutes = require("./controllers/search");
app.use(searchRoutes(conn));

const accountRoutes = require("./controllers/account");
app.use(accountRoutes(conn));

const deactivateRoutes = require("./controllers/deactivate");
app.use(deactivateRoutes(conn));
