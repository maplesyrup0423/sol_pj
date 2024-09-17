import api from "../../../../auth/api";
import { useState, useEffect } from "react";
import "./BoardImg.css";
function BoardImg({ boardId }) {
  const [boardImg, setBoardImg] = useState(null); // 이미지 상태 저장

  const fetchboard_img = async () => {
    try {
      const response = await api.get(`/api/board_img/${boardId}`);
      const data = response.data;

      if (data.board_img) {
        setBoardImg(data.board_img); // 이미지가 있을 경우 상태에 저장
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchboard_img(); // 컴포넌트가 마운트될 때 API 호출
  }, [boardId]); // boardId가 변경될 때마다 다시 호출

  return (
    <div className="feed-boardImg">
      {boardImg && <img src={boardImg} alt="게시판이미지" />}
    </div>
  );
}
export default BoardImg;
