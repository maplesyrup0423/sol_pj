import "./FeedMain.css";
import Feeds from "./Feeds";
import Writing from "./Writing";
import { useState, useEffect } from "react";

function FeedMain(props) {
  const [post, setPost] = useState([]);

  useEffect(() => {
    const postCallApi = async () => {
      //유저 번호, 아이디, 프로필사진, 닉네임 받아옴
      const response = await fetch("/api/post");
      const body = await response.json();
      console.log(body); // 서버 응답 확인용
      return body;
    };
    postCallApi()
      .then((res) => setPost(res))
      .catch((err) => console.log(err));
  }, []);
  console.log("post:", post);
  return (
    <div className="feed_main">
      <div className="order">
        <div className="popularity">
          <div>인기</div>
        </div>
        <div className="Latest">
          <div>최신</div>
        </div>
      </div>

      <div className="posting">
        {/* 글쓰기 부분 
        todo DB insert문 만들기*/}
        <Writing image_url={props.image_url} />
      </div>

      <div className="feed">
        {/* 피드부분
          todo 게시판DB 받아오기 현재 하드코딩
        */}
        {post.length > 0 ? (
          post.map((p) => <Feeds key={p.post_id} {...p} />)
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
}

export default FeedMain;
