import "./Comments.css";
import { AuthContext } from "../../../../../Context/AuthContext";
import { useContext } from "react";
import Writing from "./Writing";
import FeedImages from "./FeedImages";
import ProfileImg from "../../../../utills/ProfileImg";
import { useState, useEffect } from "react";
import BasicButton from "../../../../utills/buttons/BasicButton";
import FeedMoreBtn from "./FeedMoreBtn";
import api from "../../../../auth/api";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { NavLink } from "react-router-dom";

function Comments(props) {
  const { userInfo } = useContext(AuthContext);
  const [replies, setReplies] = useState([]);

  const reload = () => {
    window.location.reload();
  };

  const fetchReplies = async () => {
    try {
      const response = await api.get(
        `/api/postDetailCommentReply/?postId=${props.postId}&parentCommentId=${props.comment_id}`
      );
      setReplies(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchReplies();
  }, [props.comment_id, props.postId]);

  const [isVisible, setIsVisible] = useState(false);

  const [isCommentVisible, setIsCommentVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleCommentVisibility = () => {
    setIsCommentVisible(!isCommentVisible);
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
  let btnText;
  if (isCommentVisible) {
    btnText = (
      <>
        <MdOutlineKeyboardArrowUp /> 숨기기
      </>
    );
  } else {
    btnText = (
      <>
        <MdOutlineKeyboardArrowDown /> 답글보기
      </>
    );
  }
  return (
    <div className="Comments-Container">
      <div
        className="FeedComment_contents"
        style={{
          marginLeft: props.parent_comment_id !== null ? "10%" : "0px", // 자식 댓글은 오른쪽으로 밀림
          backgroundColor:
            props.parent_comment_id !== null ? "#131313" : "black",
          width: props.parent_comment_id !== null ? "90%" : "100%", // 자식 댓글의 가로 길이 줄이기
        }}
      >
        <div className="FeedComment_head">
          <NavLink
            to={`/${props.user_id}`}
            className="Nav"
            state={{
              nickname: props.nickname,
              user_id: props.user_id,
              user_no: props.user_no,
              image_url: props.image_url,
              introduce: props.introduce,
            }}
          >
            <div className="FeedComment_head-left">
              <div className="FeedComment_profile">
                <ProfileImg image_url={props.image_url} />
              </div>

              <div className="FeedComment_body">
                <div className="FeedComment_up">
                  <div className="FeedComment_name">{props.nickname}</div>
                  <div className="FeedComment_id"> @{props.user_id}</div>
                </div>
              </div>
            </div>
          </NavLink>
          {/* 더보기 버튼 */}
          {userInfo.user_no === props.user_no && (
            <FeedMoreBtn
              comment_id={props.comment_id}
              comment_text={props.comment_text}
              comment_file_paths={props.file_paths}
              postId={props.postId}
              loginUser_no={userInfo.user_no}
              user_no={props.user_no}
              refreshData={
                props.parent_user_id === null ? props.refreshData : reload
              }
              boardId={props.boardId}
            />
          )}
        </div>
        <FeedImages
          file_paths={props.file_paths}
          comment_id={props.comment_id}
        />
        <div className="FeedComment_down">
          <div className="FeedComment_comment">
            {props.parent_user_id !== null && (
              <span>@{props.parent_user_id} </span>
            )}
            {props.comment_text}
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
              btnSize="mediumButton"
              btnColor="textColorYellow"
              action={toggleVisibility}
              btnText={isVisible ? "취소" : "답글쓰기"}
            />
            {/* <button onClick={toggleVisibility}>{isVisible ? '취소' : '답글 쓰기'}</button> */}
          </div>
        </div>
        {replies.length > 0 && props.parent_comment_id === null && (
          <div className="FeedComments_button">
            <BasicButton
              btnSize="mediumButton"
              btnColor="textColorYellow"
              action={toggleCommentVisibility}
              btnText={btnText}
            ></BasicButton>
          </div>
        )}
      </div>

      {userInfo ? (
        isVisible && (
          <Writing
            userInfo={userInfo}
            boardId={props.boardId}
            refreshData={reload}
            postID={props.postId}
            parent_comment_id={props.comment_id}
          />
        )
      ) : (
        <span className="data-placeholder">로그인후 이용하세요.</span>
      )}

      {/* 대댓글 렌더링 */}
      {isCommentVisible && (
        <div className="replies">
          {replies.map((reply) => (
            <Comments
              key={reply.comment_id}
              user_id={reply.user_id}
              refreshData={props.refreshData}
              boardId={props.boardId}
              postId={props.postId}
              comment_id={reply.comment_id}
              user_no={reply.user_no}
              parentCommentId={reply.comment_id}
              parent_user_id={reply.parent_user_id}
              {...reply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default Comments;
