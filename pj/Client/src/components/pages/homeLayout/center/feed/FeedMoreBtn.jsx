import { IoIosMore } from "react-icons/io";
import { Dropdown } from "react-bootstrap";
import "./FeedMoreBtn.css";
import api from "../../../../auth/api";

function FeedMoreBtn(props) {
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
              <Dropdown.Item href="#edit">수정</Dropdown.Item>
              <Dropdown.Item onClick={handlePostDelete}>삭제</Dropdown.Item>
            </>
          ) : (
            <Dropdown.Item href="#report">신고하기</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default FeedMoreBtn;
