import "./BoardName.css";
import { NavLink } from "react-router-dom";

function BoardName(props) {
  const handleClick = () => {
    if (props.onClose) {
      props.onClose(); // onClose 함수가 있을 때만 호출
    }
  };
  return (
    <li key={props.board_info_id}>
      <NavLink
        to={`/post/${props.board_info_id}`}
        style={({ isActive }) => ({
          fontWeight: isActive ? "bold" : "normal", // 활성화된 링크에 스타일 적용
          color: isActive ? "#ffcd19" : "white", // 선택된 링크의 색상
          textDecoration: "none", // 기본 링크 스타일 제거
        })}
        onClick={handleClick}
      >
        <div className="gameContainer">
          <div className="gameInfo gameImg">
            <img src={props.board_img} alt="" />
          </div>
          <div className="gameInfo gameTitle">
            &nbsp; {props.board_info_name}
          </div>
        </div>
      </NavLink>
    </li>
  );
}

export default BoardName;
