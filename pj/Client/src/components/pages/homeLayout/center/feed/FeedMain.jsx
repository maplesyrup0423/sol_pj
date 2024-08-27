import "./FeedMain.css";
import Feeds from "./Feeds";
import Writing from "./Writing";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function FeedMain({ myInfo }) {
  const { boardId } = useParams(); // URL 파라미터로 게시판 ID 가져오기
  const [data, setData] = useState([]);
  const [, setCurrentBoardId] = useState(boardId || 1);

  useEffect(() => {
    // boardId가 변경될 때만 API 호출
    const id = boardId || 1;
    setCurrentBoardId(id);

    fetch(`/api/post?board_info_id=${boardId}`) // 게시판 ID를 사용하여 데이터 요청
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [boardId]);
  console.log("data :", data);

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
        {myInfo.length > 0 ? (
          <Writing myInfo={myInfo} boardId={boardId} />
        ) : (
          "로딩"
        )}
      </div>

      <div className="feed">
        {/* 피드부분
          todo 게시판DB 받아오기 현재 하드코딩
        */}
        {data.length > 0 ? (
          data.map((p) => <Feeds key={p.post_id} {...p} />)
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
}

export default FeedMain;
