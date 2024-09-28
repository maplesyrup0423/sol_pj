import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import "./LoginHistory.css";
import { useState, useEffect, useContext } from "react";
import api from "../../../../../auth/api";
import { AuthContext } from "../../../../../../Context/AuthContext";

function LoginHistory() {
  const [data, setData] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); //뒤로가기
  };

  const fetchLoginLogs = async () => {
    try {
      const response = await api.post("/api/loginLog");
      setData(response.data.loginLogs);
    } catch (error) {
      if (error.response) {
        console.error("오류:", error.response.data.message);
      } else {
        console.error("서버에 요청하는 중 오류 발생:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchLoginLogs();
  }, [userInfo]);

  return (
    <>
      <div className="Account-header">
        <div className="BackIcon" onClick={handleBack}>
          <IoMdArrowRoundBack />
        </div>
        <span>로그인 기록</span>
      </div>
      <div className="LoginHistory-body">
        {data.length > 0 ? (
          data.map((d) => (
            <div key={d.id} className="LoginHistory-detail">
              <span>{d.login_time}</span>
              <span
                style={{
                  color: d.login_status === "SUCCESS" ? "#255df7" : "#f72b25",
                }}
              >
                {d.login_status}
              </span>
            </div>
          ))
        ) : (
          <span className="data-placeholder">로그가 없습니다.</span>
        )}
      </div>
    </>
  );
}

export default LoginHistory;
