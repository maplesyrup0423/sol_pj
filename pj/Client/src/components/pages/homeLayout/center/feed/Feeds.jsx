import "./Feeds.css";
import { IoChatbubbleOutline } from "react-icons/io5";
import ProfileImg from "../../../../utills/ProfileImg";
import { NavLink } from "react-router-dom";
import FeedImages from "./FeedImages";
import Like from "./Like";
import Bookmark from "./Bookmark";
import BoardImg from "./BoardImg";
import FollowButton from "../../../../utills/buttons/FollowButton";
import { useEffect, useState } from "react";
import checkFollowStatus from "../../../../utills/FollowStatus";
import FeedMoreBtn from "./FeedMoreBtn";

function Feeds(props) {
  const { boardId, postId } = props;
  let Expanded;
  if (props.Expanded === undefined) {
    Expanded = "feedTextShort";
  } else {
    Expanded = "";
  }

  // 팔로우 상태 확인 코드
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    const fetchFollowStatus = async () => {
      const status = await checkFollowStatus(props.loginUser_no, props.user_no);
      setIsFollowing(status);
    };

    fetchFollowStatus(); // 팔로우 상태 확인 함수 호출
  }, [props.loginUser_no, props.user_no]);
  // 여기까지 팔로우 상태 확인 코드

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
          refreshData={props.refreshData}
          boardId={boardId}
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
          {/* 팔로우 버튼 */}
          <FollowButton
            followerNo={props.loginUser_no}
            followingNo={props.user_no}
            initialIsFollowing={isFollowing}
          />
        </div>
      </div>
    </div>
  );
}

export default Feeds;
