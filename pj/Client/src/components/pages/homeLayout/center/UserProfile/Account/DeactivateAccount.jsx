import { useContext, useState } from "react";
import { AuthContext } from "../../../../../../Context/AuthContext";
import ProfileCard from "../../../left/ProfileCard";
import "./DeactivateAccount.css";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function DeactivateAccount() {
    const { userInfo } = useContext(AuthContext);
    const [checkDeactivate, setcheckDeactivate] = useState(false);
    const navigate = useNavigate();

    //뒤로가기 기능
    const handleBack = () => {
        navigate(-1); //뒤로가기
    };

    const handleDeactivate = () => {
        setcheckDeactivate(!checkDeactivate);
    };
    const handleOnSubmit = (e) => {
        e.preventDefault();
    };
    return (
        <div className="deactivateBox">
            {!checkDeactivate ? (
                <div>
                    <ProfileCard {...userInfo} />
                    <h2>계정이 비활성화 됩니다.</h2>
                    <button className="deactiveBtn" onClick={handleDeactivate}>
                        비활성화
                    </button>
                </div>
            ) : (
                <div>
                    <form onSubmit={handleOnSubmit}>
                        <div className="deactivate-header">
                            <div className="BackIcon" onClick={handleBack}>
                                <IoMdArrowRoundBack />
                            </div>
                        </div>
                        <h2>비밀번호를 확인하세요</h2>
                        <p>
                            계정에 연결된 비밀번호를 입력하여 비활성화 요청을
                            완료하세요.
                        </p>
                        <div className="pwInputBox">
                            <input type="password" placeholder="비밀번호" />
                        </div>
                        <div className="deactivateSubmit">
                            <button type="submit">비활성화</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default DeactivateAccount;
