import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./MyNotifications.css";

function MyNotifications() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); //뒤로가기
    };

    return (
        <>
            <div className="notifications-header">
                <div className="BackIcon" onClick={handleBack}>
                    <IoMdArrowRoundBack />
                </div>

                <span>알림</span>
            </div>

            <div className="noti-container">
                <ul>
                    <li>
                        <div className="noti-card">알림 1</div>
                    </li>
                    <li>
                        <div className="noti-card">알림 2</div>
                    </li>
                    <li>
                        <div className="noti-card">알림 3</div>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default MyNotifications;
