import "./UserProfile.css";
import BackArrow from "../../../../utills/buttons/BackArrow";

function UserProfile({ myInfo }) {
  console.log("myInfo : ", myInfo);
  console.log("myInfo.nickname : ", myInfo.nickname);
  return (
    <>
      <header>
        <div className="backArrow">
          <BackArrow />
        </div>
        <div className="userInfo">
          <div className="name">{myInfo[0].nickname}</div>
          <div className="nickName">@{myInfo[0].user_id}</div>
        </div>
      </header>
      <main>
        <div className="userPic">
          <div className="pic">&nbsp;</div>
          {/* <img src={props.image_url} alt="" /> */}
        </div>
        <div className="userInfo">
          <div className="name">{myInfo[0].nickname}</div>
          <div className="nickName">@{myInfo[0].user_id}</div>
          <div className="introduce">{myInfo[0].introduce}</div>
        </div>
        <div className="editProfile">프로필수정</div>
      </main>
    </>
  );
}
export default UserProfile;
