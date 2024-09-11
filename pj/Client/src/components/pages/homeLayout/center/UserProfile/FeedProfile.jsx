import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import BackArrow from "../../../../utills/buttons/BackArrow";
import { useState } from "react";
import "./FeedProfile.css";

function FeedProfile() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("posts");
  const { nickname, user_id, image_url, introduce } = location.state || {};

  // baseUrl 가져오기
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // imageUrl 조합
  const imageUrl = image_url
    ? `${baseUrl}/images/uploads/${image_url}`
    : `${baseUrl}/images/default-profile.jpg`; // 기본 프로필 이미지 경로

  const showPosts = () => {
    setActiveTab("posts");
  };

  const showComments = () => {
    setActiveTab("comments");
  };

  return (
    <>
      <header className="profileHeader">
        <div className="backArrow">
          <NavLink to="/post/1">
            <BackArrow />
          </NavLink>
        </div>
        <div className="userInfo1">
          {nickname ? (
            <>
              <div className="name">{nickname}</div>
              <div className="nickName">@{user_id}</div>
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
              <div className="name">{nickname}</div>
              <div className="nickName">@{user_id}</div>
              <div className="introduce">{introduce}</div>
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
export default FeedProfile;
