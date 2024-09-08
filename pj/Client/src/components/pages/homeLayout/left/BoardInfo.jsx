import { useState, useEffect } from "react";
import "./BoardInfo.css";
import BoardName from "./BoardName.jsx";
import More from "./More.jsx";
import api from "../../../auth/api.js";

function BoardInfo(props) {
  const [boardName, setBoardName] = useState([]);
  useEffect(() => {
    const callApi = async () => {
      try {
        const response = await api.get(
          `/api/boardInfoUser?user_no=${props.user_no}`
        );
        setBoardName(response.data);
      } catch (err) {
        console.error("Error fetching board info:", err);
      }
    };

    callApi();
  }, []);

  return (
    <div className="GameInfo">
      <ul>
        {boardName.length > 0 ? (
          boardName.map((bn) => (
            <BoardName
              key={bn.board_info_id}
              board_info_id={bn.board_info_id}
              board_info_name={bn.board_info_name}
              board_img={bn.board_img}
            />
          ))
        ) : (
          <h1>Loading...</h1>
        )}
        <More />
      </ul>
    </div>
  );
}

export default BoardInfo;
