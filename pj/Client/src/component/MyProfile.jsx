import "./MyProfile.css";
import discordImage from "./img/discord.png";

function MyProfile() {
    const userName = "임요한";
    const url = discordImage;
    const userIntro = "안녕하세요 잘부탁드립니다.";
    return (
        <div className="profileCard">
            <header>
                <div className="quitBox">X</div>
                <span>프로필 수정</span>
                <div className="save">저장</div>
            </header>
            <div className="cardMain">
                <div className="main1">
                    <img className="userImage" src={url} alt="userImage" />
                    <div className="nameContent">
                        <div className="name">이름</div>
                        <div className="userName">{userName}</div>
                    </div>
                </div>
                <div className="introContent">
                    <div className="intro">자기소개</div>
                    <div className="userIntro">{userIntro}</div>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;
