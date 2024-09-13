import "./Comments.css";

function Comments(props) {
  return (
    <div className="Comments-Container">
      <div>comment_id : {props.comment_id}</div>
      <div>user_no : {props.user_no}</div>
      <div>parent_comment_id : {props.parent_comment_id}</div>
      <div>comment_text : {props.comment_text}</div>
      <div>createDate : {props.createDate}</div>
    </div>
  );
}
export default Comments;
