import ProfileImg from "../../../utills/ProfileImg";
import "./ProfileCard.css";

import { IoIosMore } from "react-icons/io";

function ProfileCard(props) {
  return (
    <div className="profile-card">
      <div className="profile-img">
        <ProfileImg image_url={props.image_url} />
      </div>
      <div className="profile-info">
        <div className="profile-name">{props.nickname}</div>
        <div className="profile-id">@{props.user_id}</div>
      </div>
      <div className="profile-more">
        <IoIosMore />
      </div>
    </div>
  );
}

export default ProfileCard;
