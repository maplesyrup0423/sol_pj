import { useContext } from "react";
import "./Signup.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

function SignUp() {
    const { login } = useContext(AuthContext); // login 함수 확인
    const navigate = useNavigate(); // 리디렉션을 위해 사용

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const fd = new FormData(event.target);
        const signupData = Object.fromEntries(fd.entries()); // 회원가입 데이터를 저장

        const pw = signupData.password;
        const cfpw = signupData.confirmPassword;

        if (pw !== cfpw) {
            Swal.fire({
                title: "비밀번호 불일치",
                text: "비밀번호와 확인칸이 일치하지 않습니다.",
                icon: "error",
                confirmButtonText: "확인",
            });
            return; // 일치하지 않으면 더 이상 진행하지 않음
        }

        // 회원가입 요청
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signupData),
        });

        if (response.ok) {
            const data = await response.json();
            Swal.fire({
                title: "회원가입 완료",
                text: signupData.userId + "님 회원가입을 환영합니다.", // 회원가입 시 입력한 userId 사용
                icon: "success",
                confirmButtonText: "확인",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await login(signupData.userId, signupData.password); // 저장한 데이터로 로그인
                        navigate("/"); // 로그인 후 홈으로 리디렉션
                    } catch (error) {
                        Swal.fire({
                            title: "로그인 실패",
                            text: "자동 로그인에 실패했습니다. 다시 로그인해주세요.",
                            icon: "error",
                            confirmButtonText: "확인",
                        });
                    }
                }
            });
        } else {
            const errorMessage = await response.text();
            Swal.fire({
                title: "회원가입 실패",
                text:
                    errorMessage ||
                    "회원가입에 실패했습니다. 다시 시도해주세요.",
                icon: "error",
                confirmButtonText: "확인",
            });
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <form method="POST" onSubmit={onSubmitHandler}>
                    <div className="signup-input-box">
                        <label htmlFor="userId">아이디</label>
                        <input
                            type="text"
                            name="userId"
                            className="signup-input"
                        />
                    </div>
                    <div className="signup-input-box password-input">
                        <p>
                            <label htmlFor="password">비밀번호</label>
                            <input
                                type="password"
                                name="password"
                                className="signup-input"
                            />
                        </p>
                        <p>
                            <label htmlFor="password">비밀번호 확인</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="signup-input"
                            />
                        </p>
                    </div>
                    <div className="signup-input-box">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="text"
                            name="email"
                            className="signup-input"
                        />
                    </div>

                    <div className="form-button">
                        <button className="resetBtn" type="reset">
                            지우기
                        </button>

                        <button className="signupBtn">가입하기</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
