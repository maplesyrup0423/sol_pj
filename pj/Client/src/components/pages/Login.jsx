import "./Login.css";
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";

function LoginPage() {
    //아이디와 비밀번호 스테이트
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //로그인 버튼 누르면 실행되는 함수
    
    const submitHandler = async (e) => {
        e.preventDefault();
    
        const user = { username, password };
        console.log("로그인 시도:", user);
    
        try {
            console.log("서버에 요청 전송");
            const response = await axios.post(
                "/api/login",
                user,
                { withCredentials: true }
            );
            console.log("서버 응답 받음:", response);
    
            if (response.status === 200) {
                console.log("로그인 성공, 데이터:", response.data);
    
                localStorage.setItem('accessToken', response.data.accessToken);
                console.log("액세스 토큰 저장됨");
    
                console.log("리다이렉트 준비:", response.data.redirectUrl);
                window.location.href = response.data.redirectUrl;
            } else {
                console.error("로그인 실패:", response.statusText);
            }
        } catch (error) {
            console.error("로그인 요청 중 오류 발생:", error);
            if (error.response) {
                console.error("에러 응답:", error.response.data);
            }
        }
    };
    
    function nameInputChange(e) {
        setUsername(e.target.value);
    }
    function passInputChange(e) {
        setPassword(e.target.value);
    }
    return (
        <div className="log-container">
            <div className="log-wrapper">
                <form onSubmit={submitHandler}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={nameInputChange}
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
                            onChange={passInputChange}
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
