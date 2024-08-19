import "./ProfileCard.css";
import ProfileImg from "../publicComponent/ProfileImg";
import { IoIosMore } from "react-icons/io";

function ProfileCard() {
  return (
    <div>
      <table className="mainProfileTable">
        <tbody>
          <tr>
            <td rowSpan="2">
              {/*프로필 사진 */}
              <ProfileImg />
            </td>{" "}
            <td className="profileName">
              <span>임예진</span>
            </td>
            <td rowSpan={2}>
              {/*프로필 자세히 */}
              <IoIosMore />
            </td>
          </tr>

          <tr>
            <td className="profileId">
              <span>@yejin</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProfileCard;
