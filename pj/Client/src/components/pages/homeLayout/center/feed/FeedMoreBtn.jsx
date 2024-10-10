import { IoIosMore } from "react-icons/io";
import { Dropdown } from "react-bootstrap";
import "./FeedMoreBtn.css";
import api from "../../../../auth/api";
import { useState } from "react";
import WritingModal from "./WritingModal";
import { useContext } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import Swal from "sweetalert2";
import ReportModal from "./ReportModal ";

function FeedMoreBtn(props) {
  const { userInfo } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [text, setText] = useState([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // 신고 모달 상태

  const handlePostDelete = async () => {
    const result = await Swal.fire({
      title: "삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      width: "300px",
      customClass: {
        title: "custom-swal-title",
      },
    });

    if (!result.isConfirmed) {
      // "취소"를 누르면 아무 작업도 하지 않음
      return;
    }

    try {
      // 서버로 게시물 삭제 요청
      if (props.comment_id === undefined) {
        await api.post(`/api/posts/${props.postId}/delete`);
      } else {
        await api.post(`/api/comment/${props.comment_id}/delete`);
      }
      if (props.refreshData !== undefined) {
        props.refreshData();
      }
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  const openModal = async () => {
    if (props.comment_id === undefined) {
      setImages(props.post_file_paths ? props.post_file_paths.split(", ") : []);
      setText(props.post_text);
    } else {
      setImages(
        props.comment_file_paths ? props.comment_file_paths.split(", ") : []
      );
      setText(props.comment_text);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openReportModal = () => {
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
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
            <Dropdown.Item onClick={openReportModal}>신고하기</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
      {isModalOpen && (
        <WritingModal
          onClose={closeModal}
          userInfo={userInfo}
          boardId={props.boardId}
          postID={props.postId}
          isEditMode={true} // 수정 모드
          refreshData={props.refreshData}
          existingPostContent={text}
          existingImages={images}
          comment_id={props.comment_id}
        />
      )}
      {isReportModalOpen && (
        <ReportModal
          postId={props.postId}
          onClose={closeReportModal}
          userInfo={userInfo}
        />
      )}
    </div>
  );
}

export default FeedMoreBtn;
