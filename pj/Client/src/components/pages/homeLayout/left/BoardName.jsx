import "./BoardName.css";
import { Link } from "react-router-dom";
function BoardName(props) {
  return (
    <li key={props.board_info_id}>
      <div className="gameContainer">
        <div className="gameInfo gameImg">
          <img src={props.board_img} alt="" />
        </div>
        <Link to={`/post/${props.board_info_id}`}>
          <div className="gameInfo gameTitle">
            {" "}
            &nbsp; {props.board_info_name}
          </div>
        </Link>
      </div>
    </li>
  );
}
export default BoardName;
