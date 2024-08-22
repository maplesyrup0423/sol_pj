import "./Notice.css";
import { FaRegBell } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";

function Notice() {
    return (
        <div className="notice">
            <div className="notice_alert">
                <div className="alert_icon"><FaRegBell className="FaRegBell" /></div>
                <div className="alert_text">알림</div>
                <div className="alert_number"><span>3</span></div>
            </div>
            <div className="notice_bookMark">
                <div className="bookMark_icon"><FaRegBookmark className="FaRegBookmark" /></div>
                <div className="bookMark_text">북마크</div>
            </div>
        </div>
    );
}

export default Notice;