import ProfileImg from "../../../../utills/ProfileImg";
import "./Writing.css";
import BasicButton from "../../../../utills/buttons/BasicButton";
import { useState } from "react";

function Writing({ userInfo, boardId }) {
  const [, setContent] = useState("");

  const handleInputChange = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // 높이를 자동으로 조정
    textarea.style.height = textarea.scrollHeight + "px"; // 내용에 맞춰 높이 설정
    setContent(textarea.value);
  };

  return (
    <div className="write-container">
      <div className="write-row">
        <div className="profile-image">
          <ProfileImg image_url={userInfo.image_url} />
        </div>
        <div className="textarea-container">
          <textarea
            onChange={handleInputChange}
            name="postContent"
            rows={2}
            placeholder={`게시판 아이디 : ${boardId} || 글을 작성해주세요.`}
          />
        </div>
      </div>
      <div className="button-row">
        <BasicButton
          btnOn={false}
          btnSize="mediumButton"
          btnColor="yellowButton"
          action={null}
          btnText="전송"
        />
      </div>
    </div>
  );
}
export default Writing;
