import { IoIosMore } from "react-icons/io";
import { Dropdown } from "react-bootstrap";
import "./FeedMoreBtn.css";
import api from "../../../../auth/api";
import { useState, useRef } from "react";
import WritingModal from "./WritingModal";
import { useContext } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";

function FeedMoreBtn(props) {
  const { userInfo } = useContext(AuthContext);
  //console.log("FeedMoreBtn.props:", props);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postDetail, setPostDetail] = useState(null);
  const [images, setImages] = useState([]);
  const hasIncremented = useRef(false);

  const handlePostDelete = async () => {
    try {
      // 서버로 게시물 삭제 요청
      await api.post(`/api/posts/${props.postId}/delete`);
      if (props.refreshData !== undefined) {
        props.refreshData();
      }
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  const openModal = async () => {
    await fetchPostDetail();
    setIsModalOpen(true);
    if (!hasIncremented.current) {
      fetchPostDetail();
      hasIncremented.current = true;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //조회수 +1 및 게시글 데이터 가져오기
  const fetchPostDetail = async () => {
    try {
      const response = await api.get(`/api/postDetail/?postId=${props.postId}`);
      setPostDetail(response.data);
      setImages(
        response.data.file_paths ? response.data.file_paths.split(", ") : []
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="feed-more">
      <Dropdown>
        <Dropdown.Toggle as="div" className="dropdown-toggle">
          <div className="FeedIoIosMore">
            <IoIosMore />
          </div>
        </Dropdown.Toggle>

        <Dropdown.Menu
          popperConfig={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [-70, 0], // X, Y 좌표로 메뉴 위치 조정
                },
              },
            ],
          }}
        >
          {props.user_no === props.loginUser_no ? (
            <>
              <Dropdown.Item onClick={openModal}>수정</Dropdown.Item>
              <Dropdown.Item onClick={handlePostDelete}>삭제</Dropdown.Item>
            </>
          ) : (
            <Dropdown.Item href="#report">신고하기</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
      {postDetail && isModalOpen && (
        <WritingModal
          onClose={closeModal}
          userInfo={userInfo}
          boardId={props.boardId}
          postID={props.postId}
          isEditMode={true} // 수정 모드
          refreshData={props.refreshData}
          existingPostContent={postDetail.post_text}
          existingImages={images}
          //comment_id={props.comment_id}
          //todo 댓글 수정할때 처리할것
        />
      )}
    </div>
  );
}

export default FeedMoreBtn;
