import { IoIosMore } from "react-icons/io";
import { Dropdown } from "react-bootstrap";
import "./FeedMoreBtn.css";
function FeedMoreBtn(props) {
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
              <Dropdown.Item href="#delete">삭제</Dropdown.Item>
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
