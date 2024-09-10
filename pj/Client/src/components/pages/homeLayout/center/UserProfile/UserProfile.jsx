import { useState, useEffect } from "react";
import "./UserProfile.css";
import BackArrow from "../../../../utills/buttons/BackArrow";
import BasicButton from "../../../../utills/buttons/BasicButton";
import { NavLink } from "react-router-dom";
import api from "../../../../../components/auth/api";

function UserProfile() {
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/user-info"); // 서버에서 유저 정보 가져오기
        const data = response.data;

        if (data.success) {
          setUserInfo(data.user);
        } else {
          console.error("User profile fetch error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const showPosts = () => {
    setActiveTab("posts");
  };

  const showComments = () => {
    setActiveTab("comments");
  };

  const isUserInfoAvailable = userInfo && userInfo.nickname;

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
                src={
                  isUserInfoAvailable
                    ? userInfo.image_url
                    : "default-image-url.jpg"
                }
                alt=""
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
