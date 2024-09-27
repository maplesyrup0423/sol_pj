import "./ChangePassword.css";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useState } from "react";
import BasicButton from "../../../../../utills/buttons/BasicButton";
import api from "../../../../../auth/api";

function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false); // 비밀번호 불일치 상태 추가
  const [errorMessage, setErrorMessage] = useState(null); // 서버 오류 메시지 상태 추가
  const [successMessage, setSuccessMessage] = useState(null); // 성공 메시지 상태 추가

  const handleBack = () => {
    navigate(-1); //뒤로가기
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 비밀번호 변경 로직 처리

    try {
      const response = await api.post("/api/changePassword", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setErrorMessage(null);
        //todo 비밀번호 변경 성공 시 처리 로직- 로그아웃 시키고 로그인창으로 보내기
      } else {
        setErrorMessage(response.data.message); // 서버에서 받은 오류 메시지 표시
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("비밀번호 변경 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <>
      <div className="Account-header">
        <div className="BackIcon" onClick={handleBack}>
          <IoMdArrowRoundBack />
        </div>
        <span>비밀번호 변경</span>
      </div>
      <div className="ChangePassword-body">
        <form className="password-form" onSubmit={handleSubmit}>
          <div
            className={`input-group ${
              currentPassword ? "active" : ""
            } currentPassword-div`}
          >
            <label htmlFor="currentPassword">현재 비밀번호</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>

          <div className={`input-group ${newPassword ? "active" : ""}`}>
            <label htmlFor="newPassword">새 비밀번호</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordMismatch(e.target.value !== confirmPassword); // 새 비밀번호 변경 시 일치 여부 체크
              }}
              required
            />
          </div>

          <div className={`input-group ${confirmPassword ? "active" : ""}`}>
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordMismatch(e.target.value !== newPassword); // 비밀번호 확인 입력 시 일치 여부 체크
              }}
              required
            />
          </div>
          {newPassword !== "" &&
            confirmPassword !== "" &&
            (passwordMismatch ? (
              <p className="pw-error-message">비밀번호가 일치하지 않습니다.</p>
            ) : (
              <p className="pw-ok-message">비밀번호가 일치합니다.</p>
            ))}

          <p className="info">비밀번호를 변경시 자동으로 로그아웃됩니다.</p>

          <BasicButton
            // 인풋 3개다 공백이 아니고 새비밀번호 일치시만 버튼활성화
            btnOn={
              currentPassword === "" ||
              newPassword === "" ||
              confirmPassword === "" ||
              passwordMismatch
            }
            btnSize="bigButton"
            btnColor="yellowButton"
            action={null}
            btnText="저장"
            type="submit"
          />
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
        </form>
      </div>
    </>
  );
}
export default ChangePassword;
