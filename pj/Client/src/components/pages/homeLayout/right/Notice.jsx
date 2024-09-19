import { useEffect, useState } from "react";
import "./Notice.css";
import { FaRegBell } from "react-icons/fa";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import api from "../../../auth/api";

function Notice({ user_no }) {
    const currentUser_no = user_no;
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get("/notifications", {
                    params: { user_no: currentUser_no },
                });
                console.log("클라 알림 목록 : ", res.data.notifications);

                if (res.data.notifications.length > 0) {
                    setNotifications(res.data.notifications); // 전체 데이터를 설정
                    setUnreadCount(
                        res.data.filter((notif) => !notif.is_read).length
                    ); // 읽지 않은 알림 개수 설정
                }
            } catch (error) {
                console.error("알림 데이터를 불러오는 중 오류 발생: ", error);
            }
        };
        fetchNotifications();
    }, [currentUser_no]); // 의존성 배열에 currentUser_no만 포함

    return (
        <div className="notice">
            <div className="notice_alert">
                <div className="alert_icon">
                    <NavLink
                        to={"/myNotifications"}
                        style={({ isActive }) => ({
                            fontWeight: isActive ? "bold" : "normal",
                            color: isActive ? "#ffcd19" : "white",
                            textDecoration: "none",
                        })}
                    >
                        <FaRegBell className="FaRegBell" />
                    </NavLink>
                </div>
                <div className="alert_text">알림</div>
                <div className="alert_number">
                    <span>{unreadCount}</span>
                </div>
            </div>
            {/* {notifications.map((m) => (
                <div key={m.id}>받은 메세지 : {m.content}</div>
            ))} */}
            <NavLink
                to={`/Bookmark`}
                style={({ isActive }) => ({
                    fontWeight: isActive ? "bold" : "normal",
                    color: isActive ? "#ffcd19" : "white",
                    textDecoration: "none",
                })}
            >
                {({ isActive }) => (
                    <div className="notice_bookMark">
                        <div className="bookMark_icon">
                            {isActive ? (
                                <FaBookmark className="FaBookmark" /> // 활성화 시 아이콘 변경
                            ) : (
                                <FaRegBookmark className="FaRegBookmark" /> // 기본 아이콘
                            )}
                        </div>
                        <div className="bookMark_text">북마크</div>
                    </div>
                )}
            </NavLink>
        </div>
    );
}

export default Notice;
