import { Form, Navigate } from "react-router-dom";
import "./Signup.css";

function SignUp() {
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        Navigate("/");
    };
    return (
        <>
            <div className="signup-container">
                <Form method="POST" onSubmit={onSubmitHandler}>
                    <div className="signup-input-box">
                        <input type="text" placeholder="email" />
                    </div>
                    <div className="signup-input-box">
                        <input type="password" placeholder="password" />
                    </div>
                </Form>
            </div>
        </>
    );
}

export default SignUp;
