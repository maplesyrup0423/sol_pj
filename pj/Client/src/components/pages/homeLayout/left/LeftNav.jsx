import React, { useState, useEffect, useRef } from "react";
import "./LeftNav.css";
import BoardInfo from "./BoardInfo";
import ProfileCard from "./ProfileCard";
import { Link } from "react-router-dom";
import { IoIosMore } from "react-icons/io";

function LeftNav({ userInfo }) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const handleMoreClick = (event) => {
    event.stopPropagation(); // 클릭 이벤트 전파 방지
    setIsDropdownVisible(!isDropdownVisible);
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
                    <Link to="/login">로그아웃</Link>
                    {/* 일단 로그인으로 보내기만했음 로그아웃처리는 추후 */}
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
