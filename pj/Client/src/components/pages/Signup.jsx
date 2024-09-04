import "./Signup.css";
import Swal from "sweetalert2";

function SignUp() {
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const fd = new FormData(event.target);
        const data = Object.fromEntries(fd.entries());

        const pw = data.password;
        const cfpw = data.confirmPassword;

        //비밀번호 관련 로직. 여기에 모달을 달거나 할 예정
        if (pw !== cfpw) {
            Swal.fire({
                title: "비밀번호 불일치",
                text: "비밀번호와 확인칸이 일치하지 않습니다.",
                icon: "error",
                confirmButtonText: "확인",
            });
            // alert("비밀번호가 일치하지 않습니다.");
        } else {
            //서버와 통신 이거 axios나 api로 바꿀 예정임 일단 fetch로 해놨음
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const data = await response.json();
                //여기서 회원가입 후 로직 처리할거임... 뭐 로그인도 바로 시도하고 리디렉션해준다거나 그런거
                // alert(data.userId + "님 회원가입을 환영합니다.");
                Swal.fire({
                    title: "회원가입 완료",
                    text: data.userId + "님 회원가입을 환영합니다.",
                    icon: "success",
                    confirmButtonText: "확인",
                });
            }
        }
    };
    return (
        <>
            <div className="signup-container">
                <div className="signup-card">
                    <form method="POST" onSubmit={onSubmitHandler}>
                        <div className="signup-input-box">
                            <label htmlFor="userId">아이디</label>
                            <input type="text" name="userId" />
                        </div>
                        <div className="signup-input-box password-input">
                            <p>
                                <label htmlFor="password">비밀번호</label>
                                <input type="password" name="password" />
                            </p>
                            <p>
                                <label htmlFor="password">비밀번호 확인</label>
                                <input type="password" name="confirmPassword" />
                            </p>
                        </div>
                        <div className="signup-input-box">
                            <label htmlFor="email">이메일</label>
                            <input
                                type="text"
                                name="email"
                                className="signup-email"
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
        </>
    );
}

export default SignUp;
