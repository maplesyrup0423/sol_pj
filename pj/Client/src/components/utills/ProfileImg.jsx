function ProfileImg(props) {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const img = props.image_url || "default-profile.png";
  return (
    <img
      src={`${baseUrl}/images/uploads/${img}`}
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
