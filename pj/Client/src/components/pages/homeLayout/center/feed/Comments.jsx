import "./Comments.css";
import { AuthContext } from "../../../../../Context/AuthContext";
import { useContext } from "react";
import Writing from "./Writing";
import FeedImages from "./FeedImages";
function Comments(props) {
  const { userInfo } = useContext(AuthContext);
  return (
    <div className="Comments-Container">
      <div>comment_id : {props.comment_id}</div>
      <div>user_no : {props.user_no}</div>
      <div>parent_comment_id : {props.parent_comment_id}</div>
      <div>comment_text : {props.comment_text}</div>
      <div>createDate : {props.createDate}</div>
      <div>postId : {props.postId}</div>

      <FeedImages file_paths={props.file_paths} comment_id={props.comment_id} />

      {userInfo ? (
        <Writing
          userInfo={userInfo}
          boardId={props.boardId}
          refreshData={props.refreshData}
          postID={props.postId}
          parent_comment_id={props.comment_id}
        />
      ) : (
        <span className="data-placeholder">로그인후 이용하세요.</span>
      )}
    </div>
  );
}
export default Comments;
