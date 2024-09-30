import "./Policy.css";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function TermsOfService() {
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
        <span>이용약관</span>
      </div>
      <div className="Policy-body">
        <div className="Policy-title">제1조 (목적)</div>
        <p>
          이 약관은 사용자가 sol를 이용함에 있어 필요한 기본적인 사항을
          규정합니다.
        </p>

        <div className="Policy-title">제2조 (서비스 이용)</div>
        <ul>
          <li>sol는 사용자에게 무료 또는 유료로 제공됩니다.</li>
          <li>사용자는 서비스를 비상업적 목적으로만 사용할 수 있습니다.</li>
        </ul>

        <div className="Policy-title">제3조 (책임의 제한)</div>
        <ul>
          <li>sol는 사용자 콘텐츠에 대해 어떠한 책임도 지지 않습니다.</li>
          <li>
            사용자는 서비스를 이용함에 있어 타인의 권리를 침해해서는 안 됩니다.
          </li>
        </ul>

        <div className="Policy-title">제4조 (계정의 삭제)</div>
        <ul>
          <li>사용자는 언제든지 계정을 삭제할 수 있습니다.</li>
          <li>
            관리자는 서비스 악용 시 계정을 일시적으로 중지하거나 삭제할 권리가
            있습니다.
          </li>
        </ul>

        <div className="Policy-title">제5조 (약관의 변경)</div>
        <ul>
          <li>sol는 필요에 따라 이 약관을 변경할 수 있습니다.</li>
          <li>변경된 약관은 사용자에게 공지 후 적용됩니다.</li>
        </ul>
      </div>
    </>
  );
}

export default TermsOfService;
