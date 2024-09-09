import { useState, useEffect, useContext } from "react";
import "./BoardMore.css";
import { FaCog } from "react-icons/fa"; // 설정 아이콘
import ReactDOM from "react-dom";
import api from "../../../auth/api.js";
import BoardName from "./BoardName.jsx";
import { AuthContext } from "../../../../Context/AuthContext";

function BoardMore({ onClose }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [boardName, setBoardName] = useState([]);
  const [boardInfoUser, setBoardInfoUser] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const [checkedBoardIds, setCheckedBoardIds] = useState(new Set());

  const handleCancel = () => {
    setCheckedBoardIds(new Set(boardInfoUser)); // 체크된 상태를 초기 상태로 복원
    setIsSettingsOpen(false);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleCheckboxChange = (boardId) => {
    setCheckedBoardIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(boardId)) {
        updated.delete(boardId); // 체크 해제
      } else {
        updated.add(boardId); // 체크 추가
      }
      return updated;
    });
  };

  const handleApply = async () => {
    try {
      const checkedBoardArray = Array.from(checkedBoardIds);

      // 서버에 체크된 게시판 업데이트 요청
      await api.post("/api/updateUserBoard", {
        user_no: userInfo.user_no,
        board_ids: checkedBoardArray,
      });
      onClose();
    } catch (err) {
      console.error("Error updating user board info:", err);
    }
  };

  useEffect(() => {
    const fetchBoardInfo = async () => {
      try {
        const response = await api.get(`/api/boardInfo`);
        setBoardName(response.data);
      } catch (err) {
        console.error("Error fetching board info:", err);
      }
    };
    const fetchBoardInfoUser = async () => {
      try {
        const response = await api.get(
          `/api/boardInfoUser?user_no=${userInfo.user_no}`
        );
        const boardIds = response.data.map((item) => item.board_info_id); // board_info_id만 뽑아서 배열로 만듬
        setBoardInfoUser(boardIds);
        setCheckedBoardIds(new Set(boardIds)); // 초기 체크된 상태 설정
      } catch (err) {
        console.error("Error fetching board info:", err);
      }
    };

    fetchBoardInfo();
    fetchBoardInfoUser();
  }, [userInfo]);

  return ReactDOM.createPortal(
    <div className="modalOverlay">
      <div className="modalContainer">
        {/* 모달 상단 닫기 버튼 */}
        <button className="closeButton" onClick={onClose}>
          X
        </button>

        {/* 기본 화면 */}
        {!isSettingsOpen && (
          <div className="defaultView">
            <h2>게시판 더보기</h2>
            {/* 전체 게시판 목록*/}
            <ul>
              {boardName.length > 0
                ? boardName
                    .filter((bn) => !boardInfoUser.includes(bn.board_info_id))
                    .map((bn) => (
                      <BoardName
                        key={bn.board_info_id}
                        board_info_id={bn.board_info_id}
                        board_info_name={bn.board_info_name}
                        board_img={bn.board_img}
                        onClose={onClose}
                      />
                    ))
                : ""}
            </ul>
            {/* 설정 버튼 */}
            <button className="settings-board-button" onClick={toggleSettings}>
              <FaCog size={20} />
            </button>
          </div>
        )}

        {/* 설정 화면 */}
        {isSettingsOpen && (
          <div className="settingsView">
            <h2>게시판 설정</h2>
            {/* 게시판 설정 목록 */}
            <ul>
              {boardName.length > 0 ? (
                boardName.map((bn) => (
                  <li key={bn.board_info_id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checkedBoardIds.has(bn.board_info_id)}
                        onChange={() => handleCheckboxChange(bn.board_info_id)}
                      />
                      <div className="gameContainer">
                        <div className="gameInfo gameImg">
                          <img src={bn.board_img} alt="" />
                        </div>
                        <div className="gameInfo gameTitle">
                          &nbsp; {bn.board_info_name}
                        </div>
                      </div>
                    </label>
                  </li>
                ))
              ) : (
                <h1>Loading...</h1>
              )}
            </ul>
            <button onClick={handleCancel}>취소</button>
            <button onClick={handleApply}>적용</button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default BoardMore;
