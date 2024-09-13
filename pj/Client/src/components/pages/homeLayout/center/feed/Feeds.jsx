import "./Feeds.css";
import { IoIosMore } from "react-icons/io";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import ProfileImg from "../../../../utills/ProfileImg";
import { NavLink } from "react-router-dom";
import FeedImages from "./FeedImages";
import Like from "./like";

function Feeds(props) {
  const { boardId, postId } = props;

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
          </div>
        </NavLink>
        <a className="moreA" href=" ">
          <IoIosMore />
        </a>
      </div>
      {/* 이미지 모달/캐로셀 컴포넌트 */}
      <FeedImages file_paths={props.file_paths} post_id={props.post_id} />

      <NavLink to={`/post/${boardId}/${postId}`} className="feed_click">
        <div className="feed-text-container">
          <div className="feed-text">
            {/* 피드텍스트 */}
            <h5>{props.post_text}</h5>
          </div>
        </div>
        <div className="feed-CreationDate">
          {/* 작성일/조회수 등 상세 정보 */}
          <span> {props.createDate}</span>
          <span> 조회수 {props.views}</span>
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
          <FaRegBookmark size="30" />
          <FaBookmark size="30" />
        </div>
      </div>
    </div>
  );
}

export default Feeds;
