// src/components/pages/Login.jsx
import { useState, useContext } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function LoginPage() {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await login(username, password);
            // 로그인 성공 시 리디렉션
            navigate("/");
        } catch (error) {
            alert("로그인 실패: " + error.message);
        }
    };

    return (
        <div className="log-container">
            <div className="log-wrapper">
                <form method="POST" onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            name="username"
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                        />
                        <FaLock className="icon" />
                    </div>

                    <div className="remember-forgot">
                        <label>
                            <input type="checkbox" />
                            아이디 기억하기
                        </label>
                        <a href="/">비밀번호를 잃어버렸습니까?</a>
                    </div>

                    <button type="submit">로그인</button>

                    <div className="register-link">
                        <p>
                            계정이 없으신가요? <a href="/">가입하기</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
