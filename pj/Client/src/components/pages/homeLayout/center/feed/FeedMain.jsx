import "./FeedMain.css";
import Feeds from "./Feeds";
import Writing from "./Writing";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import api from "../../../../auth/api";

function FeedMain() {
  const { userInfo } = useContext(AuthContext);
  const { boardId: paramBoardId } = useParams(); // URL 파라미터로 게시판 ID 가져오기
  const [data, setData] = useState([]);
  const [defaultBoardId, setDefaultBoardId] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 추가
  const [activeTab, setActiveTab] = useState("post_date");

  const fetchBoardInfoUser = async () => {
    try {
      const response = await api.get(
        `/api/boardInfoUser?user_no=${userInfo.user_no}`
      );
      const boardIds = response.data.map((item) => item.board_info_id);

      if (boardIds.length > 0) {
        // 가장 작은 값 찾기
        const minBoardId = Math.min(...boardIds);
        setDefaultBoardId(minBoardId); // 가장 작은값
        // URL에 기본 게시판 ID로 리디렉션
        if (!paramBoardId) {
          navigate(`/post/${minBoardId}`, { replace: true });
        }
      } else {
        setDefaultBoardId(1); // 데이터가 없는 경우 1로 설정
      }
    } catch (err) {
      console.error("Error fetching board info:", err);
    }
  };
  const boardId = paramBoardId || defaultBoardId; // boardId가 undefined일 때 기본값 설정

  const fetchData = async () => {
    try {
      const response = await api.get(
        `/api/post?board_info_id=${boardId}&orderBy=${
          activeTab === "post_pop" ? "pop" : "date"
        }`
      );
      setData(response.data);
      // console.log(`Fetching posts with orderBy: ${activeTab === 'post_pop' ? 'pop' : 'date'}`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const orderBy_pop = () => {
    setActiveTab("post_pop");
    //fetchData();
  };

  const orderBy_date = () => {
    setActiveTab("post_date");
    //fetchData();
  };
  useEffect(() => {
    fetchBoardInfoUser();
  }, [userInfo]);

  useEffect(() => {
    const container = document.querySelector(".homeContainer"); // 스크롤이 발생하는 컨테이너 선택
    if (container) {
      container.scrollTop = 0;
    }
    fetchData();
  }, [boardId, activeTab, defaultBoardId]);

  let [btnActive, setBtnActive] = useState(false);

  const toggleActive = () => {
    setBtnActive((prev) => {
      return !prev;
    });
  };

  return (
    <div className="feed_main">
      <div className="order">
        <div
          className={"popularity" + (btnActive ? "" : " active")}
          onClick={toggleActive}
        >
          <div
            className={`switch-date ${
              activeTab === "post_date" ? "active" : ""
            }`}
            onClick={orderBy_date}
          >
            <div>최신</div>
          </div>
        </div>

        <div
          className={"Latest" + (btnActive ? " active" : "")}
          onClick={toggleActive}
        >
          <div
            className={`switch-pop ${activeTab === "post_pop" ? "active" : ""}`}
            onClick={orderBy_pop}
          >
            <div>인기</div>
          </div>
        </div>
      </div>

      <div className="posting">
        {/* 글쓰기 부분*/}
        {userInfo ? (
          <Writing
            userInfo={userInfo}
            boardId={boardId}
            refreshData={fetchData}
            postID={null}
            parent_comment_id={null}
          />
        ) : (
          <span className="data-placeholder">로그인후 이용해주세요</span>
        )}
      </div>

      <div className="feed_orders">
        <div className="feed_contents">
          {activeTab === "post_pop" && (
            <div className="feed">
              {data.length > 0 && userInfo !== null ? (
                data.map((p) => (
                  <Feeds
                    key={p.post_id}
                    loginUser_no={userInfo.user_no}
                    postId={p.post_id} // 게시글 ID 전달
                    boardId={boardId} // 게시판 ID 전달
                    {...p}
                  />
                ))
              ) : (
                <span className="data-placeholder">게시글이 없습니다.</span>
              )}
            </div>
          )}
          {activeTab === "post_date" && (
            <div className="feed">
              {data.length > 0 && userInfo !== null ? (
                data.map((p) => (
                  <Feeds
                    key={p.post_id}
                    loginUser_no={userInfo.user_no}
                    postId={p.post_id} // 게시글 ID 전달
                    boardId={boardId} // 게시판 ID 전달
                    {...p}
                  />
                ))
              ) : (
                <span className="data-placeholder">게시글이 없습니다.</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedMain;
