import "./Comments.css";
import { AuthContext } from "../../../../../Context/AuthContext";
import { useContext } from "react";
import Writing from "./Writing";
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

      {userInfo ? (
        <Writing
          userInfo={userInfo}
          boardId={props.boardId}
          refreshData={props.refreshData}
          postID={props.postId}
          parent_comment_id={props.comment_id}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default Comments;
