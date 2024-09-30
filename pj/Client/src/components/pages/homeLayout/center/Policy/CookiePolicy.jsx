import "./Policy.css";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function CookiePolicy() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); //뒤로가기
  };
  return (
    <>
      <div className="Policy-header">
        <div className="BackIcon" onClick={handleBack}>
          <IoMdArrowRoundBack />
        </div>
        <span>쿠키 정책</span>
      </div>
      <div className="Policy-body">
        <div className="Policy-title">1. 쿠키의 사용 목적</div>
        <p>sol는 서비스 제공과 사용자 경험 개선을 위해 쿠키를 사용합니다.</p>

        <div className="Policy-title">2. 쿠키의 종류</div>
        <ul>
          <li>필수 쿠키: 웹사이트 기본 기능 제공을 위한 쿠키</li>
          <li>분석 쿠키: 서비스 개선을 위한 사용자 활동 분석</li>
        </ul>

        <div className="Policy-title">3. 쿠키 관리</div>
        <p>
          사용자는 브라우저 설정을 통해 쿠키 사용을 제한하거나 삭제할 수
          있습니다.
        </p>
      </div>
    </>
  );
}

export default CookiePolicy;
