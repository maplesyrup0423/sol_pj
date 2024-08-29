import "./UserProfile.css";
import BackArrow from "../../../../utills/buttons/BackArrow";
import BasicButton from "../../../../utills/buttons/BasicButton";
import UserPosts from "./UserPosts";

function UserProfile({ myInfo }) {
    console.log("유저 프로필 진입");
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
                    <div className="pic">
                        <img
                            src={myInfo[0].image_url}
                            alt=""
                            className="proImg"
                        />
                    </div>
                </div>
                <div className="userInfo">
                    <div className="name">{myInfo[0].nickname}</div>
                    <div className="nickName">@{myInfo[0].user_id}</div>
                    <div className="introduce">{myInfo[0].introduce}</div>
                </div>
                <div className="editProfile">
                    <BasicButton btnText="프로필수정" />
                </div>
            </main>
            <UserPosts />
            <UserPosts />
            <UserPosts />
            <UserPosts />
            <UserPosts />
            <UserPosts />
            <UserPosts />
        </>
    );
}
export default UserProfile;
