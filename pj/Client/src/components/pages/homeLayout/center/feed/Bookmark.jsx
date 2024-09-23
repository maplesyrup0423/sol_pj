import "./Bookmark.css";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { useState, useEffect } from "react";
import api from "../../../../auth/api";

function Bookmark(props) {
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    // 페이지 로딩 시 사용자가 이미 북마크를 눌렀는지 확인
    api
      .get(`/api/posts/${props.postId}/isBookmarkByUser/${props.loginUser_no}`)
      .then((res) => setBookmark(res.data.bookmark))
      .catch((err) => console.error(err));
  }, [props.postId, props.loginUser_no]);

  const handleBookmark = async () => {
    if (bookmark) {
      // 북마크 취소
      await api
        .post(`/api/posts/${props.postId}/unBookmark/${props.loginUser_no}`)
        .then(() => setBookmark(false))
        .catch((err) => console.error(err));
      if (props.refreshData !== undefined) {
        props.refreshData();
      }
    } else {
      // 북마크 등록
      await api
        .post(`/api/posts/${props.postId}/bookmark`, {
          user_no: props.loginUser_no,
        })
        .then(() => setBookmark(true))
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="Bookmark-comment-btn" onClick={handleBookmark}>
      {bookmark ? (
        <>
          <FaBookmark
            size="25"
            className="Bookmark-icon Bookmark"
            id="FaBookmark"
          />
        </>
      ) : (
        <>
          <FaRegBookmark
            size="25"
            className="Bookmark-icon"
            id="FaRegBookmark"
          />
        </>
      )}
    </div>
  );
}

export default Bookmark;
