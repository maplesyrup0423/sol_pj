import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Feeds from "./Feeds";

function BoardPage() {
  const { boardId } = useParams(); // URL 파라미터로 게시판 ID 가져오기
  const [data, setData] = useState([]);
  const [currentBoardId, setCurrentBoardId] = useState(boardId || 1);

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
    <div>
      {/* <Feeds data={data} />  */}
      {/* FM 컴포넌트에 데이터 전달 */}
      {data.length > 0 ? (
        data.map((p) => <Feeds key={p.post_id} {...p} />)
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default BoardPage;
