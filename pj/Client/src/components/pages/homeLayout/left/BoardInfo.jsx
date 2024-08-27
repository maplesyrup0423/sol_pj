import { useState, useEffect } from "react";
import "./BoardInfo.css";
import BoardName from "./BoardName.jsx";
import More from "./More.jsx";
import axios from "axios";

function BoardInfo() {
  //const titles = ['1번', '2번', '3번', '4번', '5번'];
  //const gameList = titles.map((title, index) => <BoardName/>);
  const [boardName, setBoardName] = useState([]);

  useEffect(() => {
    const callApi = async () => {
      try {
        const response = await axios.get("/api/boardInfo");
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
        {/*보드네임 부분은 반복, 모어는 안반복 */}
        {/* {gameList} */}
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
        {/* <BoardName/> */}
        <More />
      </ul>
    </div>
  );
}

export default BoardInfo;
