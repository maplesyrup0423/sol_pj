import "./MyProfile.css";
import discordImage from "./img/discord.png";
import Savebtn from "../utilButton/Savebtn";
import Closebtn from "../utilButton/Closebtn";

function MyProfile(props) {
    // 이 부분 서버에서 가져와야 할듯?
    console.log(props.body);
    const userName = "임요한";
    const url = discordImage;
    return (
        <div className="profileCard">
            <header>
                <div className="quitBox">
                    <Closebtn />
                </div>
                <span>프로필 수정</span>
                <div className="save">
                    <Savebtn />
                </div>
            </header>
            <div className="cardMain">
                <div className="main1">
                    <img className="userImage" src={url} alt="userImage" />
                    <div className="nameContent">
                        <div className="name">이름</div>
                        <div className="userName">{userName}</div>
                    </div>
                </div>
                <div className="introContent">자기소개</div>
            </div>
        </div>
    );
}

export default MyProfile;
