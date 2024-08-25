import "./Feeds.css";
import { IoIosMore } from "react-icons/io";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import ProfileImg from "../../../../utills/ProfileImg";

function Feeds(props) {
    return (
        <div className="feed-container">
            <div className="feed-header">
                {/* 피드 헤더 */}
                <div className="user-info">
                    <ProfileImg image_url={props.image_url} />
                    <span className="user-name">{props.nickname}</span>
                    <span className="user-id">@{props.user_id}</span>
                </div>
                <a className="moreA" href=" ">
                    <IoIosMore />
                </a>
            </div>

            <div className="feed-image">
                {/* 피드이미지 */}
                {/* todo : 이미지 갯수별로 어떻게 다르게 보여줄지 알아보기 */}
                {/* 당장은 이미지 1개 부터 구현하기 */}
                {/* 임시이미지 */}
                {/* 이미지 없이 텍스트 먼저 구현하기 위해 주석처리 */}
                {/* <img
          className="feedImg1"
          src="https://cdn.pixabay.com/photo/2016/02/11/16/59/dog-1194083_1280.jpg"
          alt="1번 이미지"
        /> */}
            </div>

            <div className="feed-text">
                {/* 피드텍스트 */}
                <h5>{props.post_text}</h5>
            </div>
            <div className="feed-CreationDate">
                {/* 작성일/조회수 등 상세 정보 */}
                {/* <span>오후 4:07 </span>•<span> 2024-08-19 </span>│ */}
                <span> {props.createDate}</span>
                <span> 조회수 {props.views}</span>
            </div>
            <div className="feed-actions">
                <div className="like-comment">
                    {/* 좋아요 댓글등 왼쪽 부분 */}
                    {/* 좋아요는 로그인한 사람에 따라 하트가 달라짐 */}
                    <AiFillHeart size="30" />
                    <AiOutlineHeart size="30" />
                    <span> &nbsp;{props.likes_count} &nbsp; </span>
                    <IoChatbubbleOutline size="30" />
                    {/* todo 댓글수는 따로 comments 테이블 카운트
          좋아요도 post에 항목 없애고 따로 카운트
          아니면 둘다 post에 넣을지 고민하기 */}
                    <span> &nbsp;5 </span>
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
