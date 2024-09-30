import { useContext, useState } from "react";
import { AuthContext } from "../../../../../../Context/AuthContext";
import ProfileCard from "../../../left/ProfileCard";
import "./DeactivateAccount.css";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
    deactivateAccount,
    deactivateCheckPassword,
} from "../../../../../utills/DeactivateService";
import Swal from "sweetalert2";

function DeactivateAccount() {
    const { userInfo } = useContext(AuthContext);
    const [checkDeactivate, setcheckDeactivate] = useState(false);
    const [checkPassword, setCheckPassword] = useState(""); // 비밀번호 입력 상태
    const [error, setError] = useState(""); // 비밀번호 오류 상태

    const navigate = useNavigate();

    //뒤로가기 기능
    const handleBack = () => {
        navigate(-1); //뒤로가기
    };

    const handleDeactivate = () => {
        setcheckDeactivate(!checkDeactivate);
    };

    // 비활성화 요청 처리
    const handleOnSubmit = async (e) => {
        e.preventDefault();

        // 비밀번호 검증
        try {
            const isPasswordValid = await deactivateCheckPassword(
                userInfo.user_id,
                checkPassword
            ); // 서버로 비밀번호 검증 요청

            if (isPasswordValid) {
                // 비밀번호가 맞으면 비활성화 진행
                await deactivateAccount(userInfo);
                Swal.fire({
                    title: "비활성화",
                    text: "계정이 비활성화되었습니다.",
                    icon: "success",
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/login"); // 비활성화 후 로그인 페이지로 이동
                    }
                });
            } else {
                // 비밀번호가 틀린 경우 오류 표시
                setError("비밀번호가 일치하지 않습니다.");
            }
        } catch (error) {
            setError("비밀번호가 올바르지 않습니다. 다시 시도해 주세요.");
        }
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
                            <input
                                type="password"
                                placeholder="비밀번호"
                                value={checkPassword}
                                onChange={(e) =>
                                    setCheckPassword(e.target.value)
                                } // 비밀번호 입력 상태 관리
                            />
                        </div>
                        {error && <p className="error">{error}</p>}{" "}
                        {/* 오류 메시지 표시 */}
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
