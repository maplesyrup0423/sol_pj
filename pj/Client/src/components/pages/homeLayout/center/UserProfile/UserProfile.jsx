import { useState } from "react";
import "./UserProfile.css";
import BackArrow from "../../../../utills/buttons/BackArrow";
import BasicButton from "../../../../utills/buttons/BasicButton";
import { useContext } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import { NavLink } from "react-router-dom";

function UserProfile() {
  const { userInfo } = useContext(AuthContext);
  //현재 선택된 탭 관리
  const [activeTab, setActiveTab] = useState("posts");

  //switch-posts 클릭시 호출
  const showPosts = () => {
    setActiveTab("posts");
  };

  //switch-comments 클릭시 호출
  const showComments = () => {
    setActiveTab("comments");
  };

  // console.log("userInfo : ", userInfo);
  // console.log("userInfo.nickname : ", userInfo.nickname);
  return (
    <>
      <header>
        <div className="backArrow">
          <NavLink to="/post/1">
            <BackArrow />
          </NavLink>
        </div>
        <div className="userInfo">
          <div className="name">{userInfo.nickname}</div>
          <div className="nickName">@{userInfo.user_id}</div>
        </div>
      </header>
      <main>
        <div className="userContainer">
          <div className="userPic">
            <div className="pic">
              <img src={userInfo.image_url} alt="" className="proImg" />
            </div>
          </div>
          <div className="userInfo">
            <div className="Info">
              <div className="name">{userInfo.nickname}</div>
              <div className="nickName">@{userInfo.user_id}</div>
              <div className="introduce">{userInfo.introduce}</div>
            </div>
            <div className="edit">
              <div className="editProfile">
                <NavLink
                  to="/editProfile"
                  state={{
                    user_no: userInfo.user_no,
                    nickname: userInfo.nickname,
                    image_url: userInfo.image_url,
                    user_id: userInfo.user_id,
                    introduce: userInfo.introduce,
                  }}
                >
                  <BasicButton
                    btnSize="largeButton"
                    btnColor="inheritButton"
                    btnText="프로필수정"
                  />
                </NavLink>
              </div>
            </div>
          </div>
        </div>
        <div className="switch">
          <div
            className={`switch-posts ${activeTab === "posts" ? "active" : ""}`}
            onClick={showPosts}
          >
            게시글
          </div>
          <div
            className={`switch-comments ${
              activeTab === "comments" ? "active" : ""
            }`}
            onClick={showComments}
          >
            댓글
          </div>
        </div>
        <div className="list">
          <div className="content">
            {activeTab === "posts" && (
              <div className="posts">게시글 누르면 이게 나옴</div>
            )}
            {activeTab === "comments" && (
              <div className="comments">댓글 누르면 이게 나옴</div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
export default UserProfile;
