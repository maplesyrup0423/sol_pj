import { useState, useEffect } from "react";
import "./BoardInfo.css";
import BoardName from "./BoardName.jsx";
import More from "./More.jsx";
import api from "../../../auth/api.js";

function BoardInfo(props) {
  const [boardInfoUser, setBoardInfoUser] = useState([]);

  const fetchBoardInfoUser = async () => {
    try {
      const response = await api.get(
        `/api/boardInfoUser?user_no=${props.user_no}`
      );
      setBoardInfoUser(response.data);
    } catch (err) {
      console.error("Error fetching board info:", err);
    }
  };

  useEffect(() => {
    fetchBoardInfoUser();
  }, []);

  return (
    <div className="GameInfo">
      <ul>
        {boardInfoUser.length > 0 ? (
          boardInfoUser.map((bn) => (
            <BoardName
              key={bn.board_info_id}
              board_info_id={bn.board_info_id}
              board_info_name={bn.board_info_name}
              board_img={bn.board_img}
            />
          ))
        ) : (
          <>
            <span className="data-placeholder">선택된 게시판이없습니다.</span>
            <br />
            <span className="data-placeholder">게시판을 선택해주세요.</span>
          </>
        )}
        <More onBoardInfoUpdate={fetchBoardInfoUser} />
      </ul>
    </div>
  );
}

export default BoardInfo;
