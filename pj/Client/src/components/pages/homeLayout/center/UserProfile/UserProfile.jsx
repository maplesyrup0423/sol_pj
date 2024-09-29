import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import { NavLink, useLocation } from "react-router-dom";
import BackArrow from "../../../../utills/buttons/BackArrow";
import BasicButton from "../../../../utills/buttons/BasicButton";
import api from "../../../../auth/api";
import Feeds from "../feed/Feeds";
import "./UserProfile.css";
import MyProfile from "./EditProfile";
import FollowButton from "../../../../utills/buttons/FollowButton";
import { checkFollowStatus } from "../../../../utills/FollowService";

function UserProfile() {
  const { userInfo } = useContext(AuthContext);
  const location = useLocation();
  const bUserInfo = location.state || null;
  const [activeTab, setActiveTab] = useState("posts");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]); // 댓글 상태 추가
  const [isModalOpen, setModalOpen] = useState(false);
  const [initialIsFollowing, setInitialIsFollowing] = useState(false); // 초기 팔로우 여부 변수
  const fetchPosts = async () => {
    try {
      const userNo = bUserInfo ? bUserInfo.user_no : userInfo.user_no;
      const response = await api.post(`/userPosts/${userNo}`);
      setPosts(response.data);
    } catch (error) {
      console.error("게시글 가져오기 오류:", error);
    }
  };
  const fetchComments = async () => {
    try {
      const userNo = bUserInfo ? bUserInfo.user_no : userInfo.user_no;
      const response = await api.post(`/comments/${userNo}`);
      console.log("댓글 데이터:", response.data); // 추가된 로그
      setComments(response.data);
    } catch (error) {
      console.error("댓글 가져오기 오류:", error);
    }
  };
  useEffect(() => {
    if ((userInfo || bUserInfo) && activeTab === "posts") {
      fetchPosts();
    } else if ((userInfo || bUserInfo) && activeTab === "comments") {
      fetchComments(); // comments 탭일 때 댓글 가져오기
    }
  }, [userInfo, bUserInfo, activeTab]);

  const showPosts = () => setActiveTab("posts");
  const showComments = () => setActiveTab("comments");

  const displayedUserInfo = bUserInfo || userInfo;
  const isUserInfoAvailable = displayedUserInfo && displayedUserInfo.nickname;
  const imageUrl = isUserInfoAvailable
    ? `${baseUrl}/images/uploads/${displayedUserInfo.image_url}`
    : `${baseUrl}/images/default-profile.jpg`;

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    console.log("bUserInfo.nickname:", bUserInfo?.nickname);
    console.log("userInfo.nickname:", userInfo.nickname);

    //초기 팔로우 값 받아오는 함수
    const getFollowStatus = async () => {
      if (userInfo && bUserInfo) {
        const isfollowing = await checkFollowStatus(
          userInfo.user_no,
          bUserInfo.user_no
        );
        setInitialIsFollowing(isfollowing);
      }
    };

    getFollowStatus(); // 비동기 함수 호출
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
              {displayedUserInfo &&
              displayedUserInfo.nickname === userInfo.nickname ? (
                <div className="editProfile">
                  <button onClick={openModal} className="editBtn">
                    <BasicButton
                      btnSize="bigButton"
                      btnColor="blackButton"
                      btnText="프로필수정"
                    />
                  </button>
                </div>
              ) : (
                //팔로우 버튼 추가
                <FollowButton
                  userInfo={userInfo}
                  followingNo={displayedUserInfo.user_no}
                  initialIsFollowing={initialIsFollowing}
                />
              )}
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
                      loginUser_no={userInfo.user_no}
                      key={p.post_id}
                      postId={p.post_id}
                      boardId={p.board_info_id}
                      userInfo={bUserInfo || userInfo}
                      refreshData={fetchPosts}
                      {...p}
                    />
                  ))
                ) : (
                  <h1>게시글이 없습니다.</h1>
                )}
              </div>
            )}
            {activeTab === "comments" && (
              <div className="comments">
                {comments.length > 0 ? (
                  comments.map((c) => (
                    <Feeds
                      loginUser_no={userInfo.user_no}
                      key={c.comment_id}
                      postId={c.post_id} // 필요에 따라 postId를 설정
                      boardId={c.board_info_id} // 필요에 따라 boardId를 설정
                      userInfo={c} // 댓글 사용자 정보를 전달
                      refreshData={fetchComments}
                      {...c}
                    />
                  ))
                ) : (
                  <h1>댓글이 없습니다.</h1>
                )}
              </div>
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
