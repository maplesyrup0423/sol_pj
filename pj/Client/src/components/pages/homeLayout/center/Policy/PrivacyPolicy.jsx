import "./Policy.css";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function PrivacyPolicy() {
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
        <span>개인정보 처리방침</span>
      </div>
      <div className="Policy-body">
        <div className="Policy-title">1. 개인정보 수집 항목</div>
        <p>회원가입 시: 이메일, 사용자 이름, 비밀번호</p>
        <p>서비스 이용 시: 접속 로그, IP 주소</p>

        <div className="Policy-title">2. 개인정보 수집 목적</div>
        <p>서비스 제공 및 회원 관리</p>
        <p>법적 의무 준수 및 분쟁 해결</p>

        <div className="Policy-title">3. 개인정보 보유 및 이용 기간</div>
        <p>
          회원 탈퇴 시 모든 개인정보는 법적 의무에 따라 3개월 동안 보관되며, 그
          이후에 파기됩니다.
        </p>

        <div className="Policy-title">4. 개인정보의 제3자 제공</div>
        <p>법적 요구가 있을 시 개인정보를 제공할 수 있습니다.</p>
        <p>그 외 제3자에게는 제공되지 않습니다.</p>
      </div>
    </>
  );
}

export default PrivacyPolicy;
