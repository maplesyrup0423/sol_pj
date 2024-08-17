import "./ProfileCard.css";

function ProfileCard() {
    return (
        <div>
            <table className="mainProfileTable">
            <tbody>
                <tr>
                    <td rowSpan="2"><img src="" alt="" className="profileImage" /></td> {/*프로필 사진 */}
                    <td className="profileName"><span>임예진</span></td>
                    <td rowSpan={2}><img src="" alt="" className="profileDetail" /></td>{/*프로필 자세히 */}
                </tr>

                <tr>
                    <td className="profileId"><span>@yejin</span></td>
                </tr>
            </tbody>
            </table>
        </div>
    );
}

export default ProfileCard;