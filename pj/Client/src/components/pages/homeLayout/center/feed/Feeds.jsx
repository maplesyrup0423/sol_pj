import "./Feeds.css";
import { IoIosMore } from "react-icons/io";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import ProfileImg from "../../../../utills/ProfileImg";
import ImageViewer from "./ImageViewer";
import { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { NavLink } from "react-router-dom";
import api from "../../../../auth/api";
import Swal from "sweetalert2";

function Feeds(props) {
  const { boardId, postId } = props;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const images = props.file_paths ? props.file_paths.split(", ") : [];

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
  };

  useEffect(() => {
    // 페이지 로딩 시 사용자가 이미 좋아요를 눌렀는지 확인
    api
      .get(`/api/posts/${postId}/isLikedByUser/${props.loginUser_no}`)
      .then((res) => setLiked(res.data.liked))
      .catch((err) => console.error(err));
  }, [postId, props.loginUser_no]);

  const handleLike = () => {
    if (props.user_no === props.loginUser_no) {
      Swal.fire({
        position: "top",
        icon: "error",
        title: "자신의 게시글에는 좋아요를 누를 수 없습니다.",
        showConfirmButton: false,
        timer: 1500,
        width: "300px",
        customClass: {
          title: "custom-swal-title",
        },
      });
      return;
    }

    if (liked) {
      // 좋아요 취소
      api
        .post(`/api/posts/${postId}/unlike/${props.loginUser_no}`)
        .then(() => setLiked(false))
        .catch((err) => console.error(err));
    } else {
      // 좋아요 등록
      api
        .post(`/api/posts/${postId}/like`, { user_no: props.loginUser_no })
        .then(() => setLiked(true))
        .catch((err) => console.error(err));
    }
  };
  console.log("좋아요", `${postId} :  ${liked}`);

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
      <div className="feed-image">
        {/* 피드이미지 */}
        {images.length > 0 &&
          (images.length === 1 ? (
            <img
              src={`${baseUrl}/images/uploads_feed/${images[0]}`}
              alt={`Post ${props.post_id} image 1`}
              className="feedImg1"
              onClick={() => openModal(0)} // 이미지 클릭 시 모달 열기
            />
          ) : (
            <Carousel interval={null}>
              {images.map((filePath, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={`${baseUrl}/images/uploads_feed/${filePath}`}
                    alt={`Post ${props.post_id} image ${index + 1}`}
                    className="feedImg1"
                    onClick={() => openModal(index)} // 이미지 클릭 시 모달 열기
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ))}

        {/* 모달 컴포넌트 */}
        {isModalOpen && selectedImageIndex !== null && (
          <ImageViewer
            images={images}
            currentIndex={selectedImageIndex}
            onClose={closeModal}
            onChangeImage={(index) => setSelectedImageIndex(index)}
          />
        )}
      </div>

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
          <div className="like-comment-btn" onClick={handleLike}>
            {liked ? (
              <>
                <AiFillHeart
                  size="30"
                  className="heart-icon liked"
                  id="AiFillHeart"
                />
                <span> {`${props.like_count + 1}`} </span>
              </>
            ) : (
              <>
                <AiOutlineHeart
                  size="30"
                  className="heart-icon"
                  id="AiOutlineHeart"
                />
                <span> {props.like_count} </span>
              </>
            )}
          </div>

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
