import { NavLink } from "react-router-dom";
import ProfileImg from "../../../utills/ProfileImg";
import BasicButton from "../../../utills/buttons/BasicButton";
import "./ProfileCard.css";

import { IoIosMore } from "react-icons/io";

const moreClick = () => {
  alert("클릭");
};

function ProfileCard(props) {
  //console.log("ProfileCard props:", props);

  //todo 테이블로 쓰지 말것
  return (
    <div>
      <table className="mainProfileTable">
        <tbody>
          <tr>
            <td rowSpan="2">
              {/*프로필 사진 */}
              <ProfileImg image_url={props.image_url} />
            </td>{" "}
            <td className="profileName">
              <span>{props.nickname}</span>
            </td>
            <td rowSpan={2}>
              {/*프로필 자세히 */}
              <NavLink to="/" onClick={moreClick}>
                <IoIosMore />
              </NavLink>
            </td>
          </tr>

          <tr>
            <td className="profileId">
              <span>@{props.user_id}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProfileCard;
