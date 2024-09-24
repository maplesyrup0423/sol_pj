import ProfileImg from "../../../../utills/ProfileImg";
import "./Writing.css";
import BasicButton from "../../../../utills/buttons/BasicButton";
import { useState, useEffect, useRef } from "react";
import api from "../../../../auth/api";
import Swal from "sweetalert2";
import { BsImages } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid"; // UUID 생성 라이브러리
import { createNotification } from "../../../../utills/NotificationService";

//게시글 등록/수정, 댓글 등록/수정, 답글 등록/수정 컴포넌트
/* ***************** 
 [Writing 컴포넌트 props 값 설명]

  userInfo                로그인한 유저 정보(AuthContext)
  
  boardId                 게시판 ID
  
  refreshData             목록 데이터 갱신 함수
  
  postID                  게시글 ID
                          [입력모드 : null 게시글 등록, !null 댓글/답글 등록]
  
  parent_comment_id       댓글 부모 ID(답글시 사용)
                          
  comment_id              댓글ID
                          [입력모드 : null 댓글 등록, !null 답글 등록]
                          [수정모드 : null 게시글 수정, !null 댓글/답글 수정]
                          
  isEditMode              수정 모드 여부 
                          [true 수정모드]
                          [false 입력모드]
  
  existingPostContent     기존 글 내용
  
  existingImages          기존 이미지 URL
  
  onClose                 수정시 모달닫는 함수
  
  ------------------------------------------------------
 원하는 기능에따라 props를 Writing에 전달하여 사용 가능
 ***************** */
function Writing({
  userInfo,
  boardId,
  refreshData,
  postID = null,
  comment_id = null,
  parent_comment_id = null,
  isEditMode = false, // 수정 모드 여부
  existingPostContent = "", // 기존 글 내용
  existingImages = [], // 기존 이미지 URL
  onClose = null,
}) {
  const [, setContent] = useState(""); //textarea 높이 처리
  const [postContent, setPostContent] = useState(existingPostContent); // 사용자 입력값 처리 (수정 모드 시 기존 내용)
  const [selectedFiles, setSelectedFiles] = useState([]); // 이미지 파일들
  const [previewUrls, setPreviewUrls] = useState([]); // 이미지 미리보기 URL
  const fileInputRef = useRef(null);
  const [existingPreviewUrls, setExistingPreviewUrls] =
    useState(existingImages); // 기존 이미지 미리보기(수정시)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 버튼 비활성화 여부

  const baseUrl = import.meta.env.VITE_BASE_URL;

  //textarea 높이 처리
  const handleInputChange = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // 높이를 자동으로 조정
    textarea.style.height = textarea.scrollHeight + "px"; // 내용에 맞춰 높이 설정
    setContent(textarea.value);
    setPostContent(event.target.value); //사용자 입력 값
  };
  // 이미지 파일 선택 처리
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    // 새로 선택한 파일들의 ID와 미리보기 URL을 생성
    const updatedFiles = files.map((file) => ({
      id: uuidv4(), // 파일에 고유 식별자 추가
      file: file,
      previewUrl: URL.createObjectURL(file),
    }));

    // 파일 이름을 기준으로 중복 제거
    const existingFilesMap = new Map(
      selectedFiles.map((file) => [file.file.name, file])
    );
    updatedFiles.forEach((file) => existingFilesMap.set(file.file.name, file));
    setSelectedFiles(Array.from(existingFilesMap.values()));
  };

  useEffect(() => {
    const isPostContentChanged = postContent !== existingPostContent; // 수정 모드에서 글 내용이 변경되었는지
    const isImagesChanged =
      selectedFiles.length > 0 ||
      existingPreviewUrls.length !== existingImages.length; // 이미지가 변경되었는지

    // 수정 모드에서는 변경이 있는지 확인, 입력 모드에서는 빈 내용인지 확인
    if (isEditMode) {
      setIsButtonDisabled(!isPostContentChanged && !isImagesChanged); // 수정 모드에서는 변경된 내용이 없으면 비활성화
    } else {
      setIsButtonDisabled(postContent === "" && selectedFiles.length === 0); // 입력 모드에서는 내용이 없으면 비활성화
    }
  }, [
    postContent,
    selectedFiles,
    existingPreviewUrls,
    existingPostContent,
    existingImages,
    isEditMode,
  ]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // X버튼 클릭 시 이미지 삭제
  const handleDeleteImage = (id) => {
    const updatedFiles = selectedFiles.filter((file) => file.id !== id);
    const fileToRemove = selectedFiles.find((file) => file.id === id);

    setSelectedFiles(updatedFiles);

    // Blob URL 해제는 상태 업데이트 이후 처리
    setTimeout(() => {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }, 0);
  };

  // 기존 이미지 삭제 처리 (수정시)
  const handleDeleteExistingImage = (url) => {
    const updatedExistingUrls = existingPreviewUrls.filter(
      (imgUrl) => imgUrl !== url
    );
    setExistingPreviewUrls(updatedExistingUrls);
  };

  //form submit 버튼 클릭시  처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 수정 모드일 때만 확인 창 띄우기
    if (isEditMode) {
      const result = await Swal.fire({
        title: "수정하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "확인",
        cancelButtonText: "취소",
        width: "300px",
        customClass: {
          title: "custom-swal-title",
        },
      });

      if (!result.isConfirmed) {
        // "취소"를 누르면 아무 작업도 하지 않음
        return;
      }
    }
    const postData = new FormData();
    postData.append("postContent", postContent); // 글 내용 추가
    postData.append("user_no", userInfo.user_no); // 유저 ID 추가
    postData.append("board_info_id", boardId); // 게시판 ID 추가
    if (postID !== null) {
      postData.append("post_id", postID); // 게시글 ID 추가
    }
    if (parent_comment_id !== null) {
      postData.append("parent_comment_id", parent_comment_id); // 부모댓글 ID 추가
    }
    if (comment_id !== null) {
      postData.append("comment_id", comment_id); // 댓글 ID 추가
    }

    // 선택한 파일들을 formData에 추가
    selectedFiles.forEach(({ file }) => {
      postData.append("images", file);
    });
    existingPreviewUrls.forEach((url, index) => {
      postData.append(`existingImages[${index}]`, url); // 기존 이미지 URL들을 개별적으로 추가
    }); // 남은 기존 이미지들(수정시)
    try {
      let response;
      if (isEditMode) {
        if (comment_id === null) {
          response = await api.post("/api/postUpdate", postData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          response = await api.post("/api/commentUpdate", postData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
      } else {
        if (postID === null) {
          response = await api.post("/api/postInsert", postData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          response = await api.post("/api/commentInsert", postData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
      }
      console.log("Response:", response.data);
      //글 입력 성공시
      Swal.fire({
        position: "top",
        icon: "success",
        title: "성공적으로 등록되었습니다!",
        showConfirmButton: false,
        timer: 1500,
        width: "300px",
        customClass: {
          title: "custom-swal-title",
        },
      });

      //글 등록시 알림 보내기 기능
      await createNotification(
        userInfo.user_no,
        `${userInfo.nickname}님이 새 글을 올렸습니다.`,
        "new_post"
      );

      refreshData(); // 글목록 갱신
      setPostContent(""); // textarea값 초기화
      setSelectedFiles([]); // 선택된 이미지 초기화
      setPreviewUrls([]); // 미리보기 이미지 초기화
      setExistingPreviewUrls([]); // 기본 이미지 미리보기 초기화(수정시)

      if (onClose !== null) {
        onClose(); // 글 수정 완료시 모달 닫기
      }

      document.querySelector("textarea").style.height = "auto"; // textarea크기 초기화
    } catch (err) {
      // 글 입력 실패시
      console.error("Error inserting post:", err);
      Swal.fire({
        position: "top",
        icon: "error",
        title: "등록에 실패했습니다. 다시 시도해주세요.",
        showConfirmButton: false,
        timer: 1500,
        width: "300px",
        customClass: {
          title: "custom-swal-title",
        },
      });
    }
  };
  let fileId;
  let placeholderText;

  if (comment_id !== null) {
    fileId = "comment_id" + comment_id;
    placeholderText = "댓글을 작성해주세요.";
  } else if (postID !== null) {
    fileId = "post_id" + postID;
    placeholderText = "댓글을 작성해주세요.";
  } else if (boardId !== null) {
    fileId = "boardId" + boardId;
    placeholderText = "게시글을 작성해주세요.";
  } else {
    fileId = "err";
  }

  if (isEditMode === true) {
    placeholderText = "수정할 글을 작성해주세요.";
  }
  let reply;
  if (parent_comment_id !== null) {
    reply = "replyWrite";
  }
  return (
    <div className="write-container" id={reply}>
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
              placeholder={`${placeholderText}`}
            />
          </div>
        </div>

        <div className="preview-container">
          {/* 기존이미지 미리보기 (수정시) */}
          {existingPreviewUrls.map((url, index) => (
            <div key={url} className="image-preview">
              <img
                src={`${baseUrl}/images/uploads_feed/${url}`}
                alt={`existing-preview-${index}`}
              />
              <AiFillCloseCircle
                onClick={() => handleDeleteExistingImage(url)}
                className="img-delete-button"
              />
            </div>
          ))}
          {/* 이미지 미리보기 */}
          {selectedFiles.map(({ id, previewUrl }, index) => (
            <div key={id} className="image-preview">
              <img src={previewUrl} alt={`preview-${index}`} />
              <AiFillCloseCircle
                onClick={() => handleDeleteImage(id)}
                className="img-delete-button"
              />
            </div>
          ))}
        </div>
        <div className="buttons">
          <div className="inputImg">
            <label htmlFor={`file-${fileId || uuidv4()}`}>
              <BsImages className="file-BsImages" />
              <input
                type="file"
                name="file"
                id={`file-${fileId || uuidv4()}`} // 고유한 ID 부여
                multiple
                onChange={handleFileChange}
                className="file-input"
                ref={fileInputRef}
              />
            </label>
          </div>
          <div className="button-row">
            <BasicButton
              btnOn={isButtonDisabled}
              btnSize="mediumButton"
              btnColor="yellowButton"
              action={null}
              btnText={isEditMode ? "수정" : "전송"}
              type="submit"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
export default Writing;
