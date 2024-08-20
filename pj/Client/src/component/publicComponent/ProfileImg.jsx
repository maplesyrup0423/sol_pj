import React from "react";

function ProfileImg(props) {
  return (
    // 임시이미지
    <img
      src={props.image_url}
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
