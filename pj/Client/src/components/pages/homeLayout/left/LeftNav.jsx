import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IoIosMore } from "react-icons/io";
import "./LeftNav.css";
import BoardInfo from "./BoardInfo";
import ProfileCard from "./ProfileCard";
import { AuthContext } from "../../../../Context/AuthContext";

function LeftNav({ userInfo }) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useContext(AuthContext); // AuthContext에서 logout 함수 가져오기
  const navigate = useNavigate(); // 페이지 리다이렉트를 위한 navigate 훅

  const handleMoreClick = (event) => {
    event.stopPropagation(); // 클릭 이벤트 전파 방지
    setIsDropdownVisible(prev => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // 로그아웃 함수 호출
      navigate("/login"); // 로그인 페이지로 리다이렉트
    } catch (error) {
      console.error("로그아웃 오류:", error);
      // 사용자에게 알림 표시 또는 오류 처리
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <nav className="sidebar">
      <ul>
        <li>
          <div className="logoCon">
            <button className="logoButton">
              <Link to={"/"} className="no-hover">
                <img
                  className="logo"
                  src="/web-development.png"
                  alt="로고 이미지"
                />
              </Link>
            </button>
          </div>
        </li>
        <li>
          <BoardInfo />
        </li>

        <li id="ProfileCard_li">
          <Link to={"/myPage"}>
            {userInfo ? (
              <ProfileCard
                user_no={userInfo.user_no}
                nickname={userInfo.nickname}
                image_url={userInfo.image_url}
                user_id={userInfo.user_id}
              />
            ) : (
              <h5>
                <Link to={"/login"}>로그인 해주세욤</Link>
              </h5>
            )}
          </Link>
          <div className="profile-more">
            <IoIosMore onClick={handleMoreClick} />
            {isDropdownVisible && (
              <div ref={dropdownRef} className="dropdown-menu-up">
                <ul>
                  <li>
                    <button onClick={handleLogout}>로그아웃</button>
                    {/* 로그아웃 버튼 클릭 시 handleLogout 함수 호출 */}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default LeftNav;
