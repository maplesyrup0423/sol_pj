import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import { NavLink } from "react-router-dom";
import BackArrow from "../../../../utills/buttons/BackArrow";
import BasicButton from "../../../../utills/buttons/BasicButton";
import api from "../../../../auth/api";
import Feeds from "../feed/Feeds";
import "./UserProfile.css";

function UserProfile() {
  const { userInfo } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("posts");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("11111");
        const response = await api.get(`/userPosts/${userInfo.user_no}`);
        console.log("22222");
        console.log("서버 응답 데이터:", response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("게시글 가져오기 오류:", error);
      }
    };

    if (userInfo && activeTab === "posts") {
      console.log("fetchPosts 호출됨");
      fetchPosts();
    }
  }, [userInfo, activeTab]);

  useEffect(() => {
    console.log("현재 posts 상태:", posts);
  }, [posts]);

  const showPosts = () => setActiveTab("posts");
  const showComments = () => setActiveTab("comments");

  const isUserInfoAvailable = userInfo && userInfo.nickname;
  const imageUrl = isUserInfoAvailable
    ? `${baseUrl}/images/uploads/${userInfo.image_url}`
    : `${baseUrl}/images/default-profile.jpg`;

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
              <img src={imageUrl} alt="프로필 이미지" className="proImg" />
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
              <div className="posts">
                {posts.length > 0 ? (
                  posts.map((p) => (
                    <Feeds
                      key={p.post_id}
                      postId={p.post_id}
                      boardId={p.board_info_id}
                      {...p}
                    />
                  ))
                ) : (
                  <h1>게시글이 없습니다.</h1>
                )}
              </div>
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
