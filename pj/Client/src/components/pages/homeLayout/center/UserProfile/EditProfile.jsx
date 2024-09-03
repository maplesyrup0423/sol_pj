import { NavLink, useLocation } from "react-router-dom";
import "./EditProfile.css";
import Savebtn from "../../../../utills/buttons/Savebtn";
import Closebtn from "../../../../utills/buttons/Closebtn";
import { useState, useEffect } from "react";
import axios from "axios";

function MyProfile() {
  const location = useLocation();
  const { user_no, nickname, image_url, user_id, introduce } =
    location.state || {};

  const [userInfo, setUser] = useState({
    nickname: nickname || "",
    image_url: image_url || "",
    introduce: introduce || "",
  });

  useEffect(() => {
    // 서버에서 유저 정보를 가져오는 함수
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/login", {
          params: {
            username: user_id || "", // user_id를 사용해 유저 정보를 가져옵니다
          },
        });

        const data = response.data;

        if (data.success) {
          setUser({
            nickname: data.userInfo.nickname || "",
            image_url: "/assets/" + (data.userInfo.image_url || ""), // 이미지가 없을 경우 기본 이미지 사용
            introduce: data.userInfo.introduction || "자기소개가 없습니다.",
          });
          console.log("userInfo111 : " + userInfo);
        } else {
          alert("유저 정보를 가져올 수 없습니다. 오류 메시지: " + data.message); // 오류 메시지 포함
        }
      } catch (error) {
        console.error("유저 정보를 가져오는 중 오류 발생:", error);
      }
    };

    // user_id가 있을 때만 서버에서 데이터를 가져옵니다.
    if (user_id) {
      fetchUserProfile();
    }
  }, [user_id]);

  return (
    <>
      <div className="profileCard">
        <header>
          <div className="quitBox">
            <NavLink to="/myPage">
              <Closebtn />
            </NavLink>
          </div>
          <span>프로필 수정</span>
          <div className="save">
            <Savebtn btnText="저장" />
          </div>
        </header>
        <div className="cardMain">
          <div className="main1">
            <img
              className="userImage"
              src={userInfo.image_url}
              alt="userImage"
            />
            <div className="nameContent">
              <div className="name">이름</div>
              <div className="userName">{userInfo.nickname}</div>
            </div>
          </div>
          <div className="introContent">{userInfo.introduce}</div>
        </div>
      </div>
    </>
  );
}

export default MyProfile;
