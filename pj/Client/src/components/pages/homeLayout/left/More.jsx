import "./More.css";
import { CgMoreO } from "react-icons/cg";

function More() {
  return (
    <li>
      <div className="moreContainer">
        <div className="more image">
          <CgMoreO size={30} />
        </div>
        <div className="more text">더보기</div>
      </div>
    </li>
  );
}

export default More;
