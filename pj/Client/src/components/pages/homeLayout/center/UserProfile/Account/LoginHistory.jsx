import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import "./LoginHistory.css";

function LoginHistory() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); //뒤로가기
  };
  const login_status = "SUCCESS";
  const login_status2 = "FAIL"; // 이건 css 보기 예시용이고 실제로는 반복돌릴거임
  return (
    <>
      <div className="Account-header">
        <div className="BackIcon" onClick={handleBack}>
          <IoMdArrowRoundBack />
        </div>
        <span>로그인 기록</span>
      </div>
      <div className="LoginHistory-body">
        <div className="LoginHistory-detail">
          <p>2024. 9. 26. 오후 10:15:22</p>
          <p
            style={{
              color: login_status === "SUCCESS" ? "#255df7" : "#f72b25",
            }}
          >
            {login_status}
          </p>
        </div>
        {/* 이건 css 보기 예시용이고 실제로는 반복돌릴거임 */}
        <div className="LoginHistory-detail">
          <p>2024. 9. 26. 오후 10:15:22</p>
          <p
            style={{
              color: login_status2 === "SUCCESS" ? "#255df7" : "#f72b25",
            }}
          >
            {login_status2}
          </p>
        </div>
      </div>
    </>
  );
}
export default LoginHistory;
