import "./FeedDetail.css";
import "./Feeds.css";
import FeedComment from "./FeedComment";
import WriteComment from "./WriteComment";
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
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import api from "../../../../auth/api";
import Feeds from "./Feeds";

function FeedDetail() {
  const { boardId, postId } = useParams(); // URL에서 postId 가져오기
  const { userInfo } = useContext(AuthContext);
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
        <div className="feed_detail_top_back" onClick={handleBack}>
          <IoMdArrowRoundBack /> 뒤로 가기
        </div>
      </div>

      <Feeds
        key={postId}
        postId={postId} // 게시글 ID 전달
        userno={postDetail.userno}
        post_text={postDetail.post_text}
        createDate={postDetail.createDate}
        modiDate={postDetail.modiDate}
        views={postDetail.views}
        nickname={postDetail.nickname}
        image_url={postDetail.image_url}
        file_paths={postDetail.file_paths}
        like_count={postDetail.like_count}
        comment_count={postDetail.comment_count}
      />

      <div className="write-comment">
        {/* 댓글 쓰는 부분*/}
        <WriteComment userInfo={userInfo} boardId={boardId} postId={postId} />
      </div>
    </div>
  );
}

export default FeedDetail;
