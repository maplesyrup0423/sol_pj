import ProfileImg from "../../../../utills/ProfileImg";
import "./Writing.css";
import BasicButton from "../../../../utills/buttons/BasicButton";
import { useState } from "react";
import api from "../../../../auth/api";

function Writing({ userInfo, boardId, refreshPosts }) {
  const [, setContent] = useState("");
  const [postContent, setPostContent] = useState("");

  const handleInputChange = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // 높이를 자동으로 조정
    textarea.style.height = textarea.scrollHeight + "px"; // 내용에 맞춰 높이 설정
    setContent(textarea.value);

    setPostContent(event.target.value); //사용자 입력 값
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 서버로 보낼 데이터 구성
    const postData = {
      postContent,
      user_no: userInfo.user_no, // 유저 ID
      board_info_id: boardId, // 게시판 ID
    };

    try {
      const response = await api.post("/api/postInsert", postData);
      console.log("Response:", response.data);
      alert("글이 성공적으로 등록되었습니다!");
      refreshPosts();
      setPostContent("");
    } catch (err) {
      console.error("Error inserting post:", err);
      alert("글 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };
  return (
    <div className="write-container">
      <form onSubmit={handleSubmit}>
        <div className="write-row">
          <div className="profile-image">
            <ProfileImg image_url={userInfo.image_url} />
          </div>
          <div className="textarea-container">
            <textarea
              value={postContent}
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
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
export default Writing;
