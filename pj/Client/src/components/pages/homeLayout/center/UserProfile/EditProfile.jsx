import "./EditProfile.css";
import Savebtn from "../../../../utills/buttons/Savebtn";
import Closebtn from "../../../../utills/buttons/Closebtn";
import { useState, useEffect } from "react";
import axios from "axios";

function MyProfile() {
  console.log("에딧프로필 진입");
  // 유저 정보를 상태로 관리
  const [user, setUser] = useState({
    nickname: "",
    image_url: "",
    introduce: "",
  });

  useEffect(() => {
    // 서버에서 유저 정보를 가져오는 함수
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/login", {
          params: {
            username: "", // 현재 로그인한 유저의 아이디를 여기에 전달
          },
        });

        const data = response.data;

        if (data.success) {
          setUser({
            userName: data.user.nickname,
            image_url: "/assets/" + data.user.image_url || "", // 이미지가 없을 경우 기본 이미지 사용
            introduce: data.user.introduction || "자기소개가 없습니다.",
          });
        } else {
          alert("유저 정보를 가져올 수 없습니다.");
        }
      } catch (error) {
        console.error("유저 정보를 가져오는 중 오류 발생:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
      <div className="profileCard">
        <header>
          <div className="quitBox">
            <Closebtn />
          </div>
          <span>프로필 수정</span>
          <div className="save">
            <Savebtn />
          </div>
        </header>
        <div className="cardMain">
          <div className="main1">
            <img className="userImage" src={user.image_url} alt="userImage" />
            <div className="nameContent">
              <div className="name">이름</div>
              <div className="userName">{user.nickname}</div>
            </div>
          </div>
          <div className="introContent">{user.introduce}</div>
        </div>
      </div>
    </>
  );
}

export default MyProfile;
