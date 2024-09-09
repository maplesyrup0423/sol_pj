import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./EditProfile.css";
import Savebtn from "../../../../utills/buttons/Savebtn";
import Closebtn from "../../../../utills/buttons/Closebtn";
import api from "../../../../../components/auth/api";
import Swal from "sweetalert2";

function MyProfile() {
  const location = useLocation();
  const { user_no, nickname, image_url, user_id, introduce } =
    location.state || {};

  const [userInfo, setUser] = useState({
    nickname: nickname || "",
    image_url: image_url || "",
    introduce: introduce || "",
  });

  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/user-info");
        const data = response.data;

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
      } finally {
        setIsLoading(false); // 데이터 로딩 완료
      }
    };

    if (user_id) {
      fetchUserProfile();
    }
  }, [user_id]);

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

      if (response && response.data) {
        if (response.data.message === "프로필수정 성공!") {
          Swal.fire({
            icon: "success",
            title: "성공",
            text: "프로필이 성공적으로 수정되었습니다.",
          }).then(() => {
            // 상태 업데이트 후 페이지 새로고침을 시뮬레이션
            setUser((prevState) => ({ ...prevState }));
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "오류",
            text: `프로필 수정 실패: ${response.data.error}`,
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
                  {/* https://ossam5.tistory.com/263 자료출처 */}
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
