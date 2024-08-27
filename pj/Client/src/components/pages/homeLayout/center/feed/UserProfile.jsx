import "./UserProfile.css";
import BackArrow from "../../../../utills/buttons/BackArrow";

function UserProfile(Props) {
  return (
    <>
      <header>
        <div class="backArrow">
          <BackArrow />
        </div>
        <div className="userInfo">
          <div className="name">임예진</div>
          <div className="nickName">@yejin0423</div>
        </div>
      </header>
      <main>
        <div className="userPic">
          <div className="pic">&nbsp;</div>
        </div>
        <div className="userInfo">
          <div className="name">임예진</div>
          <div className="nickName">@yejin0423</div>
          <div className="introduce">심심합니다. 뭘 해야 할까요?</div>
        </div>
        <div className="editProfile">프로필수정</div>
      </main>
    </>
  );
}
export default UserProfile;
