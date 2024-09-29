import { NavLink } from "react-router-dom";
import ProfileImg from "./ProfileImg";
import "./User.css";

function User(props) {
  return (
    <NavLink
      to={`/${props.user_id}`}
      className="Nav"
      state={{
        nickname: props.following_nickname,
        user_id: props.following_id,
        user_no: props.user_no,
        image_url: props.image_url,
        introduce: props.introduce,
      }}
    >
      <div className="User-card">
        <div className="User-img">
          <ProfileImg image_url={props.image_url} />
        </div>
        <div className="User-info">
          <div className="User-name">{props.following_nickname}</div>
          <div className="User-id">@{props.following_id}</div>
        </div>
      </div>
    </NavLink>
  );
}
export default User;
