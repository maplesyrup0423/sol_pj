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
    // 폼 데이터를 추출합니다.
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
        sessionStorage.setItem("isLogin", true);
        sessionStorage.setItem("username", username);
        return redirect("/");
    } else {
        return {
            success: false,
            message: data.message || "로그인에 실패했습니다.",
        };
    }
}

//로그인 버튼 누르면 실행되는 함수
// const submitHandler = async (e) => {
//     //공백값 방지함수
//     e.preventDefault();
//     const user = { username, password };
//     console.log("아이디 : ", user.username);
//     console.log("비밀번호 : ", user.password);

//     //서버로 데이터 전송
//     try {
//         //이거 ^^l발 왜안됨? 요청이 보내지지가 않아 병123신같음
//         //해결 ^^
//         const response = await axios.post(
//             "http://localhost:5000/login",
//             user
//         );

//         if (response.status === 200) {
//             console.log("리디렉션 준비", response.data);
//             // 로그인 성공 시 미리 준비된 redirect주소로 이동!
//             window.location.href = response.data.redirectUrl;
//         } else {
//             console.error("로그인 실패:", response.statusText);
//         }
//     } catch (error) {
//         //왜 맨날 여기로 오냐고 ㅋㅋ
//         console.error("로그인 요청 중 오류 발생:", error.message);
//     }
// };
