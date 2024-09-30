import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate로 채팅방으로 이동
import api from "../../../../auth/api";
import { AuthContext } from "../../../../../Context/AuthContext";
import "./ChatFriendList.css";
import ProfileImg from "../../../../utills/ProfileImg";
import { IoMdArrowRoundBack } from "react-icons/io";

function ChatFriendList() {
  const { userInfo } = useContext(AuthContext);
  const [followerList, setFollowerList] = useState([]);
  const navigate = useNavigate();
  const navigateBack = useNavigate();

  const handleBack = () => {
    navigateBack(-1); //뒤로가기
  };

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await api.get("/chatFollowers", {
          params: { user_no: userInfo.user_no },
        });

        if (response.data.success) {
          setFollowerList(response.data.followings);
        } else {
          console.error("팔로워 정보 가져오기 실패:", response.data.message);
        }
      } catch (error) {
        console.error("팔로워 정보를 가져오는 중 오류 발생:", error);
      }
    };
    fetchFollowers();
  }, [userInfo.user_no]);

  const handleChatClick = async (follower) => {
    try {
      const checkResponse = await api.post("/checkChatRoom", {
        user1_no: userInfo.user_no,
        user2_no: follower.following_no,
      });

      if (checkResponse.data.success) {
        navigate(`/room/${checkResponse.data.room_id}`);
      } else {
        const createResponse = await api.post("/createChatRoom", {
          creator_user_no: userInfo.user_no,
          room_name: follower.following_nickname,
          user_list: [follower.following_no],
        });

        if (createResponse.data.room_id) {
          navigate(`/room/${createResponse.data.room_id}`);
        } else {
          console.error("방 생성 실패:", createResponse.data);
          alert("방 생성에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("채팅방 처리 중 오류 발생:", error);
      alert("채팅방 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div className="ChatFriendList-header">
        <div className="BackIcon" onClick={handleBack}>
          <IoMdArrowRoundBack />
        </div>

        <span>새로운 채팅방</span>
      </div>
      <div className="friendList">
        {followerList.map((follower) => (
          <div
            key={follower.following_id}
            className="friendItem"
            onClick={() => handleChatClick(follower)}
            style={{ cursor: "pointer" }}
          >
            <div className="User-card">
              <div className="User-img">
                <ProfileImg image_url={follower.following_image} />
              </div>
              <div className="User-info">
                <div className="User-name">{follower.following_nickname}</div>
                <div className="User-id">@{follower.following_id}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ChatFriendList;
