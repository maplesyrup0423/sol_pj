import React from "react";

function ProfileImg() {
  return (
    // 임시이미지
    <img
      src="https://cdn.pixabay.com/photo/2020/05/17/20/21/cat-5183427_1280.jpg"
      alt="프로필 이미지"
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        border: "1px black",
      }}
    />
  );
}

export default ProfileImg;
