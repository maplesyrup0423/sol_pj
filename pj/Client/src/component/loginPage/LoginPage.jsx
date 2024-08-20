import "./LoginPage.css";
import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";

function LoginPage() {
    //아이디와 비밀번호 스테이트
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //로그인 버튼 누르면 실행되는 함수
    const submitHandler = async (e) => {
        //공백값 방지함수
        e.preventDefault();

        //사용자정보가 많을시 폼데이터로 모아서 전달 가능(지금은 안씀)
        // const formData = new FormData(e.target);
        // const payload = Object.fromEntries(formData);

        const user = { username, password };
        console.log("아이디 : ", user.username);
        console.log("비밀번호 : ", user.password);

        //서버로 데이터 전송
        try {
            //이거 시발 왜안됨? 요청이 보내지지가 않아 병123신같음
            const response = await axios.post(
                "http://localhost:3000/myProfile",
                user
            );

            if (response.status === 200) {
                console.log("로그인 성공:", response.data);
                // 로그인 성공 시 추가 작업 수행
            } else {
                console.error("로그인 실패:", response.statusText);
            }
        } catch (error) {
            //왜 맨날 여기로 오냐고 ㅋㅋ
            console.error("로그인 요청 중 오류 발생:", error.message);
        }
    };
    function nameInputChange(e) {
        setUsername(e.target.value);
    }
    function passInputChange(e) {
        setPassword(e.target.value);
    }
    return (
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
    );
}

export default LoginPage;
