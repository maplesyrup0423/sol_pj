const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//서버 포트 5000번
const port = process.env.PORT || 5000;

const fs = require("fs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//database.json에서 DB정보 받아와서 mysql연결
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require("mysql");
const conn = mysql.createConnection({
    host: conf.host,
    port: conf.port,
    user: conf.user,
    password: conf.password,
    database: conf.database
  });
  conn.connect();


  //이 서버에 접속하는 클라이언트가  해당 경로에 접속을 하면 어떤 처리를 할 것인지 명시
  app.get("/api/test", (req, res) => {

    //조회된 데이터를 클라이언트에게 json으로 전달
    //User 테이블의 데이터
    conn.query(
        "SELECT * FROM User",
        (err,rows,fields)=>{
          res.send(rows);
        }
      );
  });

  //실제 서버 동작 + 동작중이라는 log출력   ***문자열 안에 변수 출력시 백틱(`)사용
  app.listen(port, () => console.log(`서버 동작중 ${port}`));

  // 서버 동작 확인 (http://localhost:5000/)
  // 클라이언트로 전달한 데이터 확인 (http://localhost:5000/api/test)
