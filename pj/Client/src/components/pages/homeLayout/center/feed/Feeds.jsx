import "./Feeds.css";

import { IoChatbubbleOutline } from "react-icons/io5";

import ProfileImg from "../../../../utills/ProfileImg";
import { NavLink } from "react-router-dom";
import FeedImages from "./FeedImages";
import Like from "./like";
import Bookmark from "./Bookmark";
import FeedMoreBtn from "./feedMoreBtn";
import BoardImg from "./BoardImg";

function Feeds(props) {
  const { boardId, postId } = props;
  let Expanded;
  if (props.Expanded === undefined) {
    Expanded = "feedTextShort";
  } else {
    Expanded = "";
  }

  return (
    <div className="feed-container">
      <div className="headerContainer">
        <NavLink
          to="/feedProfile"
          className="Nav"
          state={{
            nickname: props.nickname,
            user_id: props.user_id,
            image_url: props.image_url,
            introduce: props.introduce,
          }}
        >
          <div className="feed-header">
            <div className="user-info">
              <ProfileImg image_url={props.image_url} />
              <span className="user-name">{props.nickname}</span>
              <span className="user-id">@{props.user_id}</span>
            </div>
            {props.board_img === undefined ? (
              <BoardImg boardId={boardId} />
            ) : (
              ""
            )}
          </div>
        </NavLink>

        {/* 더보기 버튼 */}
        <FeedMoreBtn
          postId={postId}
          loginUser_no={props.loginUser_no}
          user_no={props.user_no}
        />
      </div>
      {/* 이미지 모달/캐로셀 컴포넌트 */}
      <FeedImages file_paths={props.file_paths} post_id={props.post_id} />

      <NavLink to={`/post/${boardId}/${postId}`} className="feed_click">
        <div className="feed-text-container">
          <div className="feed-text" id={Expanded}>
            {/* 피드텍스트 */}
            <h5>{props.post_text}</h5>
          </div>
        </div>
        <div className="feed-CreationDate">
          {/* 작성일/조회수 등 상세 정보 */}
          {props.modiDate === null ? (
            <span> {props.createDate}</span>
          ) : (
            <span> {props.modiDate} (수정됨)</span>
          )}

          <span> 조회수 {new Intl.NumberFormat().format(props.views)}</span>
        </div>
      </NavLink>

      <div className="feed-actions">
        <div className="like-comment">
          {/* 좋아요 댓글등 왼쪽 부분 */}
          {/* 좋아요는 로그인한 사람에 따라 하트가 달라짐 */}
          <Like
            postId={postId}
            loginUser_no={props.loginUser_no}
            user_no={props.user_no}
            like_count={props.like_count}
          />
          <IoChatbubbleOutline size="30" />
          <span> &nbsp;{props.comment_count} </span>
        </div>
        <div className="share-icons">
          {/* 공유 등 오른쪽 부분 */}
          <Bookmark
            postId={postId}
            loginUser_no={props.loginUser_no}
            fetchBookmarkView={props.fetchBookmarkView}
          />
        </div>
      </div>
    </div>
  );
}

export default Feeds;
