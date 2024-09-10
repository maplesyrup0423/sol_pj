import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import { NavLink } from "react-router-dom";
import BackArrow from "../../../../utills/buttons/BackArrow";
import BasicButton from "../../../../utills/buttons/BasicButton";
import "./UserProfile.css";

function UserProfile() {
  const { userInfo } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("posts");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (userInfo) {
      console.log("userInfo:", userInfo);
      console.log("image_url:", userInfo.image_url);
    }
  }, [userInfo]);

  const showPosts = () => {
    setActiveTab("posts");
  };

  const showComments = () => {
    setActiveTab("comments");
  };

  const isUserInfoAvailable = userInfo && userInfo.nickname;

  // 서버에서 제공하는 이미지 경로와 image_url을 조합
  const imageUrl = isUserInfoAvailable
    ? `${baseUrl}/images/uploads/${userInfo.image_url}` // 이미지 URL
    : `${baseUrl}/images/default-profile.jpg`; // 기본 이미지 경로

  return (
    <>
      <header className="profileHeader">
        <div className="backArrow">
          <NavLink to="/post/1">
            <BackArrow />
          </NavLink>
        </div>
        <div className="userInfo1">
          {isUserInfoAvailable ? (
            <>
              <div className="name">{userInfo.nickname}</div>
              <div className="nickName">@{userInfo.user_id}</div>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </header>
      <main>
        <div className="userContainer">
          <div className="userPic">
            <div className="pic">
              <img
                src={imageUrl} // 이미지 URL 사용
                alt="프로필 이미지"
                className="proImg"
              />
            </div>
          </div>
          <div className="userInfo">
            <div className="Info">
              {isUserInfoAvailable ? (
                <>
                  <div className="name">{userInfo.nickname}</div>
                  <div className="nickName">@{userInfo.user_id}</div>
                  <div className="introduce">{userInfo.introduce}</div>
                </>
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <div className="edit">
              <div className="editProfile">
                <NavLink
                  to="/editProfile"
                  state={{
                    user_no: isUserInfoAvailable ? userInfo.user_no : null,
                    nickname: isUserInfoAvailable ? userInfo.nickname : "",
                    image_url: isUserInfoAvailable ? userInfo.image_url : "",
                    user_id: isUserInfoAvailable ? userInfo.user_id : "",
                    introduce: isUserInfoAvailable ? userInfo.introduce : "",
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
