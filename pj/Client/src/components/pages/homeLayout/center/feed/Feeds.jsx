import "./Feeds.css";
import { IoIosMore } from "react-icons/io";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import ProfileImg from "../../../../utills/ProfileImg";
import ImageViewer from "./ImageViewer";
import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

function Feeds(props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const images = props.file_paths ? props.file_paths.split(", ") : [];

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
  };

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
        {images.length > 0 &&
          (images.length === 1 ? (
            <img
              src={images[0]}
              alt={`Post ${props.post_id} image 1`}
              className="feedImg1"
              onClick={() => openModal(0)} // 이미지 클릭 시 모달 열기
            />
          ) : (
            <Carousel slide={false}>
              {images.map((filePath, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={filePath}
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

      <div className="feed-text">
        {/* 피드텍스트 */}
        <h5>{props.post_text}</h5>
      </div>
      <div className="feed-CreationDate">
        {/* 작성일/조회수 등 상세 정보 */}
        <span> {props.createDate}</span>
        <span> 조회수 {props.views}</span>
      </div>
      <div className="feed-actions">
        <div className="like-comment">
          {/* 좋아요 댓글등 왼쪽 부분 */}
          {/* 좋아요는 로그인한 사람에 따라 하트가 달라짐 */}
          <AiFillHeart size="30" />
          <AiOutlineHeart size="30" />
          <span> &nbsp;{props.like_count} &nbsp; </span>
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
