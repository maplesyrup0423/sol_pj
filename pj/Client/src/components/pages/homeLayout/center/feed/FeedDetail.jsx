import "./FeedDetail.css";
import "./Feeds.css";
import { IoMdArrowRoundBack } from "react-icons/io";
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
import { useParams } from "react-router-dom";
import { NavLink, useNavigate  } from "react-router-dom";
import { useEffect } from "react";
import api from "../../../../auth/api";


function FeedDetail() {
  const { postId } = useParams(); // URL에서 postId 가져오기
  const [postDetail, setPostDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); //뒤로가기
  };

  // useEffect(() => {
  //   // postId를 이용해 게시물 데이터를 가져오는 API 호출
  //   const fetchPost = async () => {
  //     try {
  //       const response = await api.get(`/api/post/${postId}`);
  //       console.log(response.data);
  //       console.log(response.data);
  //       setPostDetail(response.data);
  //     } catch (error) {
  //       console.error("Error fetching post detail:", error);
  //     }
  //   };

  //   fetchPost();
  // }, [postId]);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await api.get(`/api/postDetail/?postId=${postId}`);
        setPostDetail(response.data); // 게시물 데이터 설정
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>오류가 발생했습니다: {error.message}</p>;

  const images = postDetail.file_paths ? postDetail.file_paths.split(", ") : [];

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
  };



  return (
    <div className="feed_detail">
      <div className="feed_detail_top">
        <div className="feed_detail_top_back" onClick={handleBack} ><IoMdArrowRoundBack /> 뒤로 가기</div>
      </div>

      {/* <h2>{post.post_text}</h2>
    <p>작성자: {post.nickname}</p>
    <p>조회수: {post.views}</p> */}

      <div className="feed-container">
        <div className="feed-header">
          {/* 피드 헤더 */}
          <div className="user-info">
            <ProfileImg image_url={postDetail.image_url} />
            <span className="user-name">{postDetail.nickname}</span>
            <span className="user-id">@{postDetail.user_id}</span>
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
                src={`${baseUrl}/images/uploads/${images[0]}`}
                alt={`Post ${postDetail.post_id} image 1`}
                className="feedImg1"
                onClick={() => openModal(0)} // 이미지 클릭 시 모달 열기
              />
            ) : (
              <Carousel interval={null}>
                {images.map((filePath, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={`${baseUrl}/images/uploads/${filePath}`}
                      alt={`Post ${postDetail.post_id} image ${index + 1}`}
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

        <div className="feed-text-container">
          <div className="feed-text">
            {/* 피드텍스트 */}
            <h5>{postDetail.post_text}</h5>
          </div>
        </div>
        <div className="feed-CreationDate">
          {/* 작성일/조회수 등 상세 정보 */}
          <span> {postDetail.createDate}</span>
          <span> 조회수 {postDetail.views}</span>
        </div>

        <div className="feed-actions">
          <div className="like-comment">
            {/* 좋아요 댓글등 왼쪽 부분 */}
            {/* 좋아요는 로그인한 사람에 따라 하트가 달라짐 */}
            <AiFillHeart size="30" />
            <AiOutlineHeart size="30" />
            <span> &nbsp;{postDetail.like_count} &nbsp; </span>
            <IoChatbubbleOutline size="30" />
            <span> &nbsp;{postDetail.comment_count} </span>
          </div>
          <div className="share-icons">
            {/* 공유 등 오른쪽 부분 */}
            <FaRegBookmark size="30" />
            <FaBookmark size="30" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedDetail;
