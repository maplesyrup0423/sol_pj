import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import { NavLink, useLocation } from "react-router-dom";
import BackArrow from "../../../../utills/buttons/BackArrow";
import BasicButton from "../../../../utills/buttons/BasicButton";
import api from "../../../../auth/api";
import Feeds from "../feed/Feeds";
import "./UserProfile.css";
import MyProfile from "./EditProfile";

function UserProfile() {
  // bUserInfo는 피드에서 보내오는 정보, UserInfo는 현재 로그인한 사용자의 정보
  const { userInfo } = useContext(AuthContext);
  const location = useLocation();
  const bUserInfo = location.state || null;
  const [activeTab, setActiveTab] = useState("posts");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userNo = bUserInfo ? bUserInfo.user_no : userInfo.user_no;
        const response = await api.get(`/userPosts/${userNo}`);
        setPosts(response.data);
      } catch (error) {
        console.error("게시글 가져오기 오류:", error);
      }
    };

    if ((userInfo || bUserInfo) && activeTab === "posts") {
      fetchPosts();
    }
  }, [userInfo, bUserInfo, activeTab]);

  const showPosts = () => setActiveTab("posts");
  const showComments = () => setActiveTab("comments");

  const displayedUserInfo = bUserInfo || userInfo; // 표시할 사용자 정보 결정
  const isUserInfoAvailable = displayedUserInfo && displayedUserInfo.nickname;
  const imageUrl = isUserInfoAvailable
    ? `${baseUrl}/images/uploads/${displayedUserInfo.image_url}`
    : `${baseUrl}/images/default-profile.jpg`;

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    console.log("bUserInfo.nickname:", bUserInfo?.nickname);
    console.log("userInfo.nickname:", userInfo.nickname);
  }, [bUserInfo, userInfo]);

  return (
    <>
      <main>
        <div className="userContainer">
          <div className="backArrow">
            <NavLink to="/post/1">
              <BackArrow />
            </NavLink>
          </div>
          <div className="userPic">
            <div className="pic">
              <img src={imageUrl} alt="프로필 이미지" className="proImg" />
            </div>
          </div>
          <div className="userInfo">
            <div className="Info">
              {isUserInfoAvailable ? (
                <>
                  <div className="name">{displayedUserInfo.nickname}</div>
                  <div className="nickName">@{displayedUserInfo.user_id}</div>
                  <div className="introduce">{displayedUserInfo.introduce}</div>
                </>
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <div className="edit">
              <div className="editProfile">
                {/* displayedUserInfo.nickname과 userInfo.nickname 비교 */}
                {displayedUserInfo &&
                displayedUserInfo.nickname === userInfo.nickname ? (
                  <button onClick={openModal} className="editBtn">
                    <BasicButton
                      btnSize="largeButton"
                      btnColor="inheritButton"
                      btnText="프로필수정"
                    />
                  </button>
                ) : null}
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
                      userInfo={bUserInfo || userInfo} // bUserInfo 정보를 전달
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
        {isModalOpen && (
          <MyProfile closeModal={closeModal} userInfo={displayedUserInfo} />
        )}
      </main>
    </>
  );
}

export default UserProfile;
