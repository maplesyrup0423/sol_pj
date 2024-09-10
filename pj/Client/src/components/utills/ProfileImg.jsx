function ProfileImg(props) {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  return (
    <img
      src={`${baseUrl}/images/uploads/${props.image_url}`}
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
