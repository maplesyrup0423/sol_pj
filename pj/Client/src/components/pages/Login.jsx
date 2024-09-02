import "./Login.css";
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Form, redirect } from "react-router-dom";

function LoginPage() {
    //아이디와 비밀번호 스테이트
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function nameInputChange(e) {
        setUsername(e.target.value);
    }
    function passInputChange(e) {
        setPassword(e.target.value);
    }
    return (
        <div className="log-container">
            <div className="log-wrapper">
                <Form method="POST">
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

                    <button>로그인</button>

                    <div className="register-link">
                        <p>
                            계정이 없으신가요? <a href="/">가입하기</a>
                        </p>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;

export async function action({ request }) {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
        sessionStorage.setItem("isLogin", true);
        sessionStorage.setItem("username", username);
        localStorage.setItem("accessToken", data.accessToken);
        return redirect("/");
    } else {
        return {
            success: false,
            message: data.message || "로그인에 실패했습니다.",
        };
    }
}
