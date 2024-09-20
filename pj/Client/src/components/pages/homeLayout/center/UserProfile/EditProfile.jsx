import { useContext, useState, useRef } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import "./EditProfile.css";
import Savebtn from "../../../../utills/buttons/Savebtn";
import Closebtn from "../../../../utills/buttons/Closebtn";
import api from "../../../../../components/auth/api";
import Swal from "sweetalert2";

function MyProfile({ closeModal }) {
  const { userInfo } = useContext(AuthContext);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [userProfile, setUserProfile] = useState({
    nickname: userInfo.nickname || "",
    introduce: userInfo.introduce || "",
  });
  const [previewImageUrl, setPreviewImageUrl] = useState(
    userInfo.image_url
      ? `${baseUrl}/images/uploads/${userInfo.image_url}`
      : "/default-profile.png"
  );

  const fileInputRef = useRef(null);

  // 닉네임 유효성 검사 함수
  const isNicknameValid = (nickname) => {
    const regex = /^[a-zA-Z가-힣0-9]{1,12}$/;
    return regex.test(nickname);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setUserProfile((prevState) => ({
          ...prevState,
          image_url: imageUrl,
        }));
        setPreviewImageUrl(imageUrl);
      } else {
        Swal.fire({
          icon: "error",
          title: "오류",
          text: "이미지 파일만 선택할 수 있습니다.",
        });
      }
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    // 닉네임 유효성 검사 추가
    if (!isNicknameValid(userProfile.nickname)) {
      Swal.fire({
        icon: "error",
        title: "오류",
        text: "닉네임은 한글, 영어 대소문자로 1~12자 이내여야 합니다.",
      });
      return; // 닉네임이 유효하지 않으면 서버로 요청하지 않음
    }

    const formData = new FormData();
    formData.append("nickname", userProfile.nickname);
    formData.append("introduce", userProfile.introduce);
    formData.append("user_no", userInfo.user_no);

    if (fileInputRef.current.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    try {
      const response = await api.post("/mypage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response && response.data) {
        const { message, error } = response.data;
        if (message === "프로필 수정 성공!") {
          Swal.fire({
            icon: "success",
            title: "성공",
            text: "프로필이 성공적으로 수정되었습니다.",
          }).then(() => {
            window.location.reload(); // 페이지 새로고침
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

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="profileCard">
          <header>
            <div className="quitBox">
              <button onClick={closeModal} className="closeBtn">
                <Closebtn />
              </button>
            </div>
            <span>프로필 수정</span>
          </header>
          <form onSubmit={handleSaveProfile}>
            <div className="main1">
              <div className="gallery">
                <figure>
                  <img
                    className="userImage"
                    src={previewImageUrl}
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
                <div className="nameHeader">닉네임</div>
                <input
                  type="text"
                  id="userName"
                  name="nickname"
                  value={userProfile.nickname}
                  onChange={handleInputChange}
                  placeholder="닉네임을 입력하세요"
                />
              </div>
            </div>

            <div className="introContent">
              <div className="introHeader">자기소개</div>
              <textarea
                id="introduce"
                name="introduce"
                value={userProfile.introduce}
                onChange={handleInputChange}
                placeholder="자기소개를 입력하세요"
              />
            </div>

            <button type="submit" className="saveBtn">
              <Savebtn btnText="저장" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
