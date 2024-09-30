import "./FeedImages.css";
import Carousel from "react-bootstrap/Carousel";
import ImageViewer from "./ImageViewer";
import { useState } from "react";

function FeedImages(props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const images = props.file_paths ? props.file_paths.split(", ") : [];

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
  };
  let id;
  if (props.post_id !== null) {
    id = "post_id" + props.post_id;
  } else if (props.comment_id !== null) {
    id = "comment_id" + props.comment_id;
  } else {
    id = "err";
  }
  return (
    <>
      <div className="feed-image">
        {/* 피드이미지 */}
        {images.length > 0 &&
          (images.length === 1 ? (
            <img
              src={`${baseUrl}/images/uploads_feed/${images[0]}`}
              alt={`Post ${id} image 1`}
              className="feedImg1"
              onClick={() => openModal(0)} // 이미지 클릭 시 모달 열기
            />
          ) : (
            <Carousel interval={null}>
              {images.map((filePath, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={`${baseUrl}/images/uploads_feed/${filePath}`}
                    alt={`Post ${id} image ${index + 1}`}
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
    </>
  );
}

export default FeedImages;
