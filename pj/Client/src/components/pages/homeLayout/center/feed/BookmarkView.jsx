import "./BookmarkView.css";
import { useState, useEffect, useContext, useRef } from "react";
import api from "../../../../auth/api";
import Feeds from "./Feeds";
import { AuthContext } from "../../../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function BookmarkView() {
  const { userInfo } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const navigate = useNavigate();
  const hasIncremented = useRef(false);

  const handleBack = () => {
    navigate(-1); //뒤로가기
  };

  const fetchBookmarkView = async () => {
    if (page === 1) {
      setData([]);
    }
    try {
      const response = await api.get(
        `/api/bookmark?user_no=${userInfo.user_no}&page=${page}&limit=10`
      );
      if (response.data.length > 0) {
        setData((prevData) => [...prevData, ...response.data]); // 기존 데이터에 추가
      } else {
        setHasMore(false); // 더 이상 불러올 데이터가 없을 경우
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const target = document.querySelector(".scroll-observer");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1); // 페이지 증가
        }
      },
      { threshold: 0.5 } // 스크롤이 50% 아래로 갔을 때
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

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    if (page === 1 && !hasIncremented.current) {
      fetchBookmarkView();
      hasIncremented.current = true;
    }
  }, [userInfo]);

  useEffect(() => {
    if (page > 1) {
      fetchBookmarkView();
    }
  }, [page]);

  return (
    <>
      <div className="BookmarkView-header">
        <div className="BackIcon" onClick={handleBack}>
          <IoMdArrowRoundBack />
        </div>

        <span>북마크</span>
      </div>
      <div className="Bookmark-Feeds">
        {data.length > 0 && userInfo !== null ? (
          <>
            {data.map((p) => (
              <Feeds
                key={p.post_id}
                loginUser_no={userInfo.user_no}
                postId={p.post_id} // 게시글 ID 전달
                boardId={p.board_info_id} // 게시판 ID 전달
                refreshData={fetchBookmarkView}
                {...p}
              />
            ))}
            <div className="scroll-observer"></div> {/* 무한 스크롤 트리거 */}
          </>
        ) : (
          <span className="data-placeholder">북마크한 게시글이 없습니다.</span>
        )}
      </div>
    </>
  );
}

export default BookmarkView;
