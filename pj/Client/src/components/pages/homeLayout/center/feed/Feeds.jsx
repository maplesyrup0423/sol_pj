import "./Feeds.css";
import { IoChatbubbleOutline } from "react-icons/io5";
import ProfileImg from "../../../../utills/ProfileImg";
import { NavLink } from "react-router-dom";
import FeedImages from "./FeedImages";
import Like from "./Like";
import Bookmark from "./Bookmark";
import BoardImg from "./BoardImg";
import FeedMoreBtn from "./FeedMoreBtn";

function Feeds(props) {
  const { boardId, postId } = props;
  // ↓↓↓↓↓↓↓↓↓↓KBM 표기 코드
  function formatViews(views) {
    if (views >= 1000000000) {
      return (views / 1000000000).toFixed(1) + "B"; // 십억 단위 (b)
    } else if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M"; // 백만 단위 (m)
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K"; // 천 단위 (k)
    } else {
      return views.toString(); // 천 미만은 그대로
    }
  }
  // ↑↑↑↑↑↑↑↑↑↑KBM 표기 코드
  // ↓↓↓↓↓↓↓↓↓↓게시글 줄임 확인 코드
  let Expanded;
  if (props.Expanded === undefined) {
    Expanded = "feedTextShort";
    //feedTextShort일 경우 post_text를 3줄로 표기
  } else {
    Expanded = "";
  }
  // ↑↑↑↑↑↑↑↑↑↑게시글 줄임 확인 코드

  // ↓↓↓↓↓↓↓↓↓↓DATETIME 관련 코드
  // 날짜 시간 포맷팅 함수
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

  // ↑↑↑↑↑↑↑↑↑↑DATETIME 관련 코드 끝

  return (
    <div className="feed-container">
      <div className="headerContainer">
        <NavLink
          to={`/${props.user_id}`}
          className="Nav"
          state={{
            nickname: props.nickname,
            user_id: props.user_id,
            user_no: props.user_no, // user_no 추가
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
          post_text={props.post_text}
          post_file_paths={props.file_paths}
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
            <span> {formatCreateDate}</span>
          ) : (
            <span> {formatModiDate}</span>
          )}

          <span> 조회수 {formatViews(props.views)}</span>
        </div>
      </NavLink>

      <div className="feed-actions">
        <div className="like-comment">
          {/* 좋아요 댓글등 왼쪽 부분 */}
          {/* 좋아요는 로그인한 사람에 따라 하트가 달라짐 */}
          <Like
            postId={postId}
            comment_id={null}
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
            refreshData={props.refreshData}
          />
        </div>
      </div>
    </div>
  );
}

export default Feeds;
