import "./FeedMain.css";
import Feeds from "./Feeds";
import Writing from "./Writing";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import api from "../../../../auth/api";

function FeedMain() {
  const { userInfo } = useContext(AuthContext); //로그인한 유저 정보
  const { boardId: paramBoardId } = useParams(); // URL 파라미터로 게시판 ID 가져오기
  const [data, setData] = useState([]); // 보여줄 데이터
  const [defaultBoardId, setDefaultBoardId] = useState([]); // 게시판 선택이 아닌 최초 실행시 보여줄 게시판 ID
  const navigate = useNavigate(); // useNavigate 훅 추가(최초 리디렉션시 사용)
  const [activeTab, setActiveTab] = useState("post_date"); // 최신순or인기순 확인 값 (기본적으로 최신순정렬)
  const [page, setPage] = useState(1); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터 여부
  // ↓↓↓↓↓↓↓↓↓↓메인 실행 시 가장 먼저 보여줄 게시판(boardId)을 정하는 코드
  // 본인이 선택한 게시판 중 ID 값이 가장 작은 게시판을 보여줌
  // 선택한 게시판이 없는 경우 1번 게시판을 보여줌
  // 해당 게시판 경로로 리디렉션
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
        navigate(`/post/1`, { replace: true });
      }
    } catch (err) {
      console.error("Error fetching board info:", err);
    }
  };
  const boardId = paramBoardId || defaultBoardId; // URL 파라미터로 받아오는 boardId가 undefined일 때 기본값 설정
  // ↑↑↑↑↑↑↑↑↑↑메인 실행 시 가장 먼저 보여줄 게시판을 정하는 코드

  // ↓↓↓↓↓↓↓↓↓↓보여줄 데이터 요청 코드
  const fetchData = async () => {
    try {
      if (page === 1) {
        setData([]); // 데이터 초기화
      }
      const response = await api.get(
        `/api/post?board_info_id=${boardId}&orderBy=${
          activeTab === "post_pop" ? "pop" : "date"
        }&page=${page}&limit=10`
      );
      if (response.data.length > 0) {
        setData((prevData) => [...prevData, ...response.data]); // 기존 데이터에 추가
      } else {
        setHasMore(false); // 더 이상 불러올 데이터가 없을 경우
        console.log("데이터 더 없음");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // ↑↑↑↑↑↑↑↑↑↑ 보여줄 데이터 요청 코드

  // ↓↓↓↓↓↓↓↓↓↓ 인기순 or 최신순 변경
  const orderBy_pop = () => {
    setActiveTab("post_pop");
  };

  const orderBy_date = () => {
    setActiveTab("post_date");
  };

  let [btnActive, setBtnActive] = useState(false);

  const toggleActive = () => {
    setBtnActive((prev) => {
      return !prev;
    });
  };
  // ↑↑↑↑↑↑↑↑↑↑인기순 or 최신순 변경 및 css 설정
  useEffect(() => {
    fetchBoardInfoUser();
  }, [userInfo]);

  useEffect(() => {
    const container = document.querySelector(".homeContainer"); // 스크롤이 발생하는 컨테이너 선택
    if (container) {
      container.scrollTop = 0;
    }
    if (boardId) {
      setPage(1);
      setHasMore(true);
    }
  }, [boardId, activeTab]);

  useEffect(() => {
    if (page === 1 && boardId.length > 0) {
      fetchData();
    }
  }, [page, activeTab, boardId]);

  useEffect(() => {
    if (page > 1 && boardId.length > 0) {
      fetchData(); // 페이지가 1보다 클 때만 호출
    }
  }, [page]);

  useEffect(() => {
    const target = document.querySelector(".scroll-observer");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, data]);

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
          />
        ) : (
          <span className="data-placeholder">로그인후 이용해주세요.</span>
        )}
      </div>
      <div className="feed_orders">
        <div className="feed_contents">
          {/* 인기순 */}
          {activeTab === "post_pop" && (
            <div className="feed">
              {data.length > 0 && userInfo !== null ? (
                <>
                  {data.map((p) => (
                    <Feeds
                      key={p.post_id}
                      board_img="hide"
                      loginUser_no={userInfo.user_no}
                      postId={p.post_id} // 게시글 ID 전달
                      boardId={boardId} // 게시판 ID 전달
                      refreshData={fetchData} // 피드 목록 갱신 함수
                      {...p}
                    />
                  ))}
                  <div className="scroll-observer"></div>
                </>
              ) : (
                <span className="data-placeholder">게시글이 없습니다.</span>
              )}
            </div>
          )}
          {/* 최신순 */}
          {activeTab === "post_date" && (
            <div className="feed">
              {data.length > 0 && userInfo !== null ? (
                <>
                  {data.map((p) => (
                    <Feeds
                      key={p.post_id}
                      board_img="hide"
                      loginUser_no={userInfo.user_no}
                      postId={p.post_id} // 게시글 ID 전달
                      boardId={boardId} // 게시판 ID 전달
                      refreshData={fetchData} // 피드 목록 갱신 함수
                      {...p}
                    />
                  ))}
                  <div className="scroll-observer"></div>
                </>
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
