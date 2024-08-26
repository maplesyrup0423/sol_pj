import ProfileImg from "../../../utills/ProfileImg";
import "./ProfileCard.css";

import { IoIosMore } from "react-icons/io";

function ProfileCard(props) {
    //console.log("ProfileCard props:", props);
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
                            <IoIosMore />
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
