import "./BookmarkView.css";
import { useState, useEffect, useContext } from "react";
import api from "../../../../auth/api";
import Feeds from "./Feeds";
import { AuthContext } from "../../../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function BookmarkView() {
  const { userInfo } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); //뒤로가기
  };

  const fetchBookmarkView = async () => {
    try {
      const response = await api.get(
        `/api/bookmark?user_no=${userInfo.user_no}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchBookmarkView();
  }, [userInfo]);

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
          data.map((p) => (
            <Feeds
              key={p.post_id}
              loginUser_no={userInfo.user_no}
              postId={p.post_id} // 게시글 ID 전달
              boardId={p.board_info_id} // 게시판 ID 전달
              fetchBookmarkView={fetchBookmarkView}
              {...p}
            />
          ))
        ) : (
          <span className="data-placeholder">북마크한 게시글이 없습니다.</span>
        )}
      </div>
    </>
  );
}

export default BookmarkView;
