import "./Comments.css";
import { AuthContext } from "../../../../../Context/AuthContext";
import { useContext } from "react";
import Writing from "./Writing";
import FeedImages from "./FeedImages";
import ProfileImg from "../../../../utills/ProfileImg";
import { useState, useEffect } from "react";
import BasicButton from "../../../../utills/buttons/BasicButton";

function Comments(props) {
  const { userInfo } = useContext(AuthContext);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await api.get(
          `/api/postDetailComment/?postId=${props.postId}&parentCommentId=${props.comment_id}`
        );
        setReplies(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReplies();
  }, [props.comment_id, props.postId]);

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const formatDate = (datetime) => {
    const date = new Date(datetime);

    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Seoul",
    };

    const formatter = new Intl.DateTimeFormat("ko-KR", options);
    return formatter.format(date);
  };
  // 등록일
  const formatCreateDate = formatDate(props.createDate);

  // 수정일
  const formatModiDate = props.modiDate
    ? formatDate(props.modiDate) + " (수정됨)"
    : "";

  return (
    <div className="Comments-Container">
      {/* <div>comment_id : {props.comment_id}</div>
      <div>user_no : {props.user_no}</div>
      <div>parent_comment_id : {props.parent_comment_id}</div>
      <div>comment_text : {props.comment_text}</div>
      <div>createDate : {props.createDate}</div>
      <div>postId : {props.postId}</div> */}

      <div className="FeedComment_contents">
        <div className="FeedComment_head">
          <div className="FeedComment_profile">
            <ProfileImg image_url={props.image_url} />
          </div>

          <div className="FeedComment_body">
            <div className="FeedComment_up">
              <div className="FeedComment_name">{props.nickname}</div>
              <div className="FeedComment_id"> @{userInfo.user_id}</div>
            </div>

            <div className="FeedComment_down">
              <div className="FeedComment_comment">{props.comment_text}</div>
            </div>
          </div>
        </div>

        <div className="FeedComment_foot">
          <div className="FeedComment_date">
            {props.modiDate === null ? (
              <span> {formatCreateDate}</span>
            ) : (
              <span> {formatModiDate}</span>
            )}
          </div>
          <div className="FeedComment_button">
            <BasicButton
              btnSize="smallButton"
              btnColor="yellowButton"
              action={toggleVisibility}
              btnText={isVisible ? "취소" : "답글"}
              type="submit"
            />
            {/* <button onClick={toggleVisibility}>{isVisible ? '취소' : '답글 쓰기'}</button> */}
          </div>
        </div>
      </div>

      <FeedImages file_paths={props.file_paths} comment_id={props.comment_id} />

      {userInfo ? (
        isVisible && (
          <Writing
            userInfo={userInfo}
            boardId={props.boardId}
            refreshData={props.refreshData}
            postID={props.postId}
            parent_comment_id={props.comment_id}
          />
        )
      ) : (
        <span className="data-placeholder">로그인후 이용하세요.</span>
      )}


      {/* 대댓글 렌더링 */}
      <div className="replies">
        {replies.map((reply) => (
          <Comments
            key={reply.comment_id}
            refreshData={props.refreshData} // 부모 컴포넌트에서 전달받은 refreshData
            boardId={props.boardId} // 필요한 props 전달
            postId={props.postId} // 필요한 props 전달
            comment_id={reply.comment_id} // 대댓글의 ID
            user_no={reply.user_no} // 대댓글 작성자의 user_no
            {...reply} // 나머지 필요한 props 전달
          />
        ))}
      </div>

    </div>
  );
}
export default Comments;
