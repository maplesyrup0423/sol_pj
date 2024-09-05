import "./FeedMain.css";
import Feeds from "./Feeds";
import FeedDetail from "./FeedDetail";
import Writing from "./Writing";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import api from "../../../../auth/api";

function FeedMain() {
  const { userInfo } = useContext(AuthContext);
  const { boardId: paramBoardId } = useParams(); // URL 파라미터로 게시판 ID 가져오기
  //! 메인 화면 첫 페이지에 보여줄 게시판 1번으로 하드코딩 <--메인 화면 첫 페이지는 전체 게시글도 괜찮을듯?
  //todo 추후 유저가 선택한 게시판 중 가장 높은 id 번호로 지정되게 수정 예정
  const boardId = paramBoardId || 1; // boardId가 undefined일 때 기본값 1 설정
  const [data, setData] = useState([]);
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

  const [activeTab, setActiveTab] = useState("post_pop");

  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시물을 관리하는 상태

  const orderBy_pop = () => {
    setActiveTab("post_pop");
    //fetchData();
  };

  const orderBy_date = () => {
    setActiveTab("post_date");
    //fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [boardId, activeTab]);

  let [btnActive, setBtnActive] = useState(false);

  const toggleActive = (e) => {
    setBtnActive((prev) => {
      return !prev;
    });
  };

  const handlePostClick = (post) => {
    setSelectedPost(post); // 게시물이 클릭되면 선택된 게시물을 설정
  };

  const handleBackToFeed = () => {
    setSelectedPost(null); // 세부 화면에서 다시 목록으로 돌아가면 null로 설정
  };


    // FeedDetail을 표시할 때 FeedMain의 전체 UI가 FeedDetail로 대체됨
    if (selectedPost) {
      return (
        <div className="feed_main">
          <FeedDetail post={selectedPost} onBack={handleBackToFeed} />
        </div>
      );
    }


  return (
    <div className="feed_main">
      <div className="order">
        <div className="popularity">
          <div
            className={`switch-pop ${activeTab === "post_pop" ? "active" : ""}`}
            onClick={orderBy_pop}
          >
            <span
              className={"pop" + (btnActive ? "" : " active")}
              onClick={toggleActive}
            >
              인기
            </span>
          </div>
        </div>
        <div className="Latest">
          <div
            className={`switch-date ${
              activeTab === "post_date" ? "active" : ""
            }`}
            onClick={orderBy_date}
          >
            <span
              className={"late" + (btnActive ? " active" : "")}
              onClick={toggleActive}
            >
              최신
            </span>
          </div>
        </div>
      </div>

      <div className="posting">
        {/* 글쓰기 부분 
        todo DB insert문 만들기*/}
        {userInfo ? (
          <Writing
            userInfo={userInfo}
            boardId={boardId}
            refreshPosts={fetchData}
          />
        ) : (
          ""
        )}
      </div>

      <div className="feed_orders">
        <div className="feed_contents">
          {activeTab === "post_pop" && (
            <div className="feed">
              {data.length > 0 ? (
                data.map((p) => <Feeds key={p.post_id} {...p} onClick={() => handlePostClick(p)} />)
              ) : (
                <h1>Loading...</h1>
              )}
            </div>
          )}
          {activeTab === "post_date" && (
            <div className="feed">
              {data.length > 0 ? (
                data.map((p) => <Feeds key={p.post_id} {...p} onClick={() => handlePostClick(p)} />)
              ) : (
                <h1>Loading...</h1>
              )}
            </div>
          )}
        </div>
      </div>

      {/* <div className="feed">
        {data.length > 0 ? (
          data.map((p) => <Feeds key={p.post_id} {...p} />)
        ) : (
          <h1>Loading...</h1>
        )}
      </div> */}
    </div>
  );
}

export default FeedMain;
