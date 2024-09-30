import "./FeedDetail.css";
import "./Feeds.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../../Context/AuthContext";
import api from "../../../../auth/api";
import Feeds from "./Feeds";
import Writing from "./Writing";
import Comments from "./Comments";

function FeedDetail() {
  const { boardId, postId } = useParams(); // URL에서 postId 가져오기
  const { userInfo } = useContext(AuthContext);
  const [postDetail, setPostDetail] = useState(null);
  const [postDetailComment, setPostDetailComment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const hasIncremented = useRef(false); // 조회수 증가가 한 번만 실행되도록 제어할 useRef

  const handleBack = () => {
    navigate(-1); //뒤로가기
  };

  //댓글가져오기
  const fetchPostDetailComment = async () => {
    try {
      const response = await api.get(
        `/api/postDetailComment/?postId=${postId}`
      );
      setPostDetailComment(response.data); // 댓글 데이터 설정
    } catch (err) {
      setError(err);
    }
  };

  //조회수 +1 및 게시글 데이터 가져오기
  const fetchPostDetail = async () => {
    try {
      const response = await api.get(`/api/postDetail/?postId=${postId}`);
      setPostDetail(response.data); // 게시물 데이터 설정
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("삭제되었거나 없는 게시물입니다.");
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasIncremented.current) {
      fetchPostDetail();
      hasIncremented.current = true;
    }
    fetchPostDetailComment();
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="FeedDetail-error">{error}</div>;

  return (
    <div className="feed_detail">
      <div className="feed_detail_top">
        <div className="feed_detail_top_back" onClick={handleBack}>
          <IoMdArrowRoundBack /> 뒤로 가기
        </div>
      </div>

      {userInfo !== null ? (
        <Feeds
          key={postId}
          loginUser_no={userInfo.user_no}
          postId={postId} // 게시글 ID 전달
          boardId={boardId}
          user_no={postDetail.user_no}
          user_id={postDetail.user_id}
          post_text={postDetail.post_text}
          createDate={postDetail.createDate}
          modiDate={postDetail.modiDate}
          views={postDetail.views}
          nickname={postDetail.nickname}
          image_url={postDetail.image_url}
          file_paths={postDetail.file_paths}
          like_count={postDetail.like_count}
          comment_count={postDetail.comment_count}
          Expanded={"Expanded"}
          refreshData={fetchPostDetail}
        />
      ) : (
        <span className="data-placeholder">로그인후 이용하세요.</span>
      )}

      <div className="write-comment">
        {/* 댓글 쓰는 부분*/}
        {/* <WriteComment userInfo={userInfo} postId={postId} /> */}

        {userInfo ? (
          <Writing
            userInfo={userInfo}
            boardId={boardId}
            refreshData={fetchPostDetailComment}
            postID={postId}
          />
        ) : (
          <span className="data-placeholder">로그인후 이용하세요.</span>
        )}
      </div>
      <div className="all_comments">
        {postDetailComment.length > 0 ? (
          postDetailComment.map((c) => (
            <Comments
              key={c.comment_id}
              parent_user_id={null}
              user_id={c.user_id}
              refreshData={fetchPostDetailComment}
              boardId={boardId}
              postId={postId}
              comment_id={c.comment_id}
              user_no={c.user_no}
              {...c}
            />
          ))
        ) : (
          <span className="data-placeholder">댓글이 없습니다.</span>
        )}
      </div>
    </div>
  );
}

export default FeedDetail;
