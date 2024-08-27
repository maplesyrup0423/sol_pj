import "./FeedMain.css";
import Feeds from "./Feeds";
import Writing from "./Writing";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function FeedMain({ myInfo }) {
  const { boardId: paramBoardId } = useParams(); // URL 파라미터로 게시판 ID 가져오기
  //! 메인 화면 첫 페이지에 보여줄 개사판 1번으로 하드코딩
  //todo 추후 유저가 선택한 게시판 중 가장 높은 id 번호로 지정되게 수정 예정
  const boardId = paramBoardId || 1; // boardId가 undefined일 때 기본값 1 설정
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/post?board_info_id=${boardId}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [boardId]);
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
