//각 모듈 호출 정리
const express = require("express");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const mysql = require("mysql");
const fs = require('fs');
const http = require('http');

//Express, HTTP 서버 생성후 socket.io와 연결
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//database.json에서 DB정보 받아와서 mysql연결
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const conn = mysql.createConnection({
    host: conf.host,
    port: conf.port,
    user: conf.user,
    password: conf.password,
    database: conf.database
  });
  conn.connect();


//서버 포트 5000번
const port = process.env.PORT || 5000;


  //서버 시작시 콘솔 + 포트번호 출력
  app.listen(port, () => console.log(`서버 동작중 ${port}`));

  // 서버 동작 확인 (http://localhost:5000/)
  
