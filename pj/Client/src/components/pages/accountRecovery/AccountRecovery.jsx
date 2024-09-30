import { useState } from "react";
import api from "../../auth/api";
import "./AccountRecovery.css";

const AccountRecovery = () => {
    const [user_id, setUser_id] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleRecoverAccount = async () => {
        try {
            await api.post("/recover-account", {
                user_id,
            });
            setSuccessMessage(
                "계정이 성공적으로 복구되었습니다. 다시 로그인해 주세요."
            );
            setError(null);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError("해당 이메일의 계정을 찾을 수 없습니다.");
            } else {
                setError(
                    "계정 복구 중 오류가 발생했습니다. 다시 시도해 주세요."
                );
            }
        }
    };

    return (
        <div className="re-container">
            <h2>계정 복구</h2>
            <p>계정을 복구하려면 아이디를 입력해 주세요.</p>
            <input
                type="text"
                value={user_id}
                onChange={(e) => setUser_id(e.target.value)}
                placeholder="아이디"
            />
            <button onClick={handleRecoverAccount}>계정 복구</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && (
                <p style={{ color: "green" }}>{successMessage}</p>
            )}
        </div>
    );
};

export default AccountRecovery;
