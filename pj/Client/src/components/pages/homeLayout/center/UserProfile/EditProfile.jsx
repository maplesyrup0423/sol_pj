import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./EditProfile.css";
import Savebtn from "../../../../utills/buttons/Savebtn";
import Closebtn from "../../../../utills/buttons/Closebtn";
import api from "../../../../../components/auth/api";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";

function MyProfile() {
  const location = useLocation();
  const { user_no, nickname, image_url, user_id, introduce } =
    location.state || {};

  // 콘솔에 전달된 state 출력
  console.log("EditProfile에서 받은 state:", location.state);

  const [userInfo, setUser] = useState({
    nickname: nickname || "",
    image_url: image_url || "",
    introduce: introduce || "",
  });

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // 선택한 파일의 미리보기 URL 생성
      setUser((prevState) => ({
        ...prevState,
        image_url: imageUrl,
      }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nickname", userInfo.nickname);
    formData.append("introduce", userInfo.introduce);
    formData.append("user_no", user_no);

    if (fileInputRef.current.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    try {
      const response = await api.post("/mypage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("서버 응답 데이터:", response.data); // 서버 응답을 로그로 확인

      if (response && response.data) {
        console.log("서버 응답 데이터:", response.data); // 이 로그를 통해 응답 확인
        const { message, error } = response.data;
        if (message && message === "프로필 수정 성공!") {
          Swal.fire({
            icon: "success",
            title: "성공",
            text: "프로필이 성공적으로 수정되었습니다.",
          }).then(() => {
            // 페이지를 새로고침합니다.
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "오류",
            text: `프로필 수정 실패: ${message || error}`,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "오류",
          text: "서버 응답을 받지 못했습니다.",
        });
      }
    } catch (error) {
      console.error(
        "프로필 수정 중 오류 발생:",
        error.response ? error.response.data : error.message
      );
      Swal.fire({
        icon: "error",
        title: "오류",
        text: "서버와의 통신 오류가 발생했습니다.",
      });
    }
  };

  useEffect(() => {
    // 서버에서 유저 정보를 가져오는 함수
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/user-info"); // 유저 정보를 가져오는 엔드포인트로 수정
        const data = response.data;

        console.log("서버 응답 데이터:", data);

        if (data.success) {
          setUser({
            nickname: data.user.nickname || "",
            image_url: data.user.image_url || "", // 이미지가 없을 경우 기본 이미지 사용
            introduce: data.user.introduce || "자기소개가 없습니다.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "오류",
            text: `유저 정보를 가져올 수 없습니다. 오류 메시지: ${data.message}`,
          });
        }
      } catch (error) {
        console.error("유저 정보를 가져오는 중 오류 발생:", error);
        Swal.fire({
          icon: "error",
          title: "오류",
          text: "서버와의 통신 오류가 발생했습니다.",
        });
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
        </header>
        <div className="cardMain">
          <form onSubmit={handleSaveProfile}>
            <div className="main1">
              <div className="gallery">
                <figure>
                  <img
                    className="userImage"
                    src={userInfo.image_url || "/default-profile.png"}
                    alt="userImage"
                  />
                  <figcaption onClick={() => fileInputRef.current.click()}>
                    <span className="material-symbols-outlined">image</span>
                  </figcaption>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </figure>
              </div>
              <div className="nameContent">
                <div className="nameHeader">이름</div>
                <input
                  type="text"
                  id="userName"
                  name="nickname"
                  value={userInfo.nickname}
                  onChange={handleInputChange}
                  placeholder="이름을 입력하세요"
                />
              </div>
            </div>

            <div className="introContent">
              <div className="introHeader">자기소개</div>
              <textarea
                id="introduce"
                name="introduce"
                value={userInfo.introduce}
                onChange={handleInputChange}
                placeholder="자기소개를 입력하세요"
              />
            </div>

            <button type="submit" className="save">
              <Savebtn btnText="저장" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default MyProfile;
