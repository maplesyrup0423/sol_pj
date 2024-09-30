import Closebtn from "../../../../utills/buttons/Closebtn";
import Writing from "./Writing";
import "./WritingModal.css";

function WritingModal({
  onClose,
  userInfo,
  boardId,
  postID,
  existingPostContent,
  existingImages,
  refreshData,
  comment_id,
  isEditMode,
}) {
  return (
    <div className="WritingModalOverlay">
      <div className="WritingModalContainer">
        {/* 모달 상단 닫기 버튼 */}
        <button className="closeButton" onClick={onClose}>
          <Closebtn />
        </button>
        <Writing
          userInfo={userInfo}
          boardId={boardId}
          postID={postID}
          existingPostContent={existingPostContent}
          existingImages={existingImages}
          refreshData={refreshData}
          comment_id={comment_id}
          isEditMode={isEditMode}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

export default WritingModal;
