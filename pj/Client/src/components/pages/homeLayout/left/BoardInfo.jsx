import { useState, useEffect } from "react";
import "./BoardInfo.css";
import BoardName from "./BoardName.jsx";
import More from "./More.jsx";

function BoardInfo() {
  //const titles = ['1번', '2번', '3번', '4번', '5번'];
  //const gameList = titles.map((title, index) => <BoardName/>);
  const [boardName, setBoardName] = useState([]);

  useEffect(() => {
    const callApi = async () => {
      const response = await fetch("/api/boardInfo");
      const body = await response.json();
      return body;
    };

    callApi()
      .then((res) => setBoardName(res))
      .catch((err) => console.log(err));
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
