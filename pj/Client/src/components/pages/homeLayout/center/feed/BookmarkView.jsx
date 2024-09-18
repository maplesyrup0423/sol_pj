//import "./BookmarkView.css";
import { useState, useEffect } from "react";
import api from "../../../../auth/api";
import Feeds from "./Feeds";
import { useContext } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";

function BookmarkView() {
  const { userInfo } = useContext(AuthContext);
  const [data, setData] = useState([]);
  console.log("userInfo.user_no", userInfo.user_no);
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
      <div>북마크</div>
      {data.length > 0 && userInfo !== null ? (
        data.map((p) => (
          <Feeds
            key={p.post_id}
            loginUser_no={userInfo.user_no}
            postId={p.post_id} // 게시글 ID 전달
            boardId={p.board_info_id} // 게시판 ID 전달
            {...p}
          />
        ))
      ) : (
        <span className="data-placeholder">게시글이 없습니다.</span>
      )}
    </>
  );
}

export default BookmarkView;
