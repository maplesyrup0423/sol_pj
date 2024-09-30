import { useContext, useEffect } from "react";
import "./Notice.css";
import { FaRegBell } from "react-icons/fa";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import api from "../../../auth/api";
import { NotificationContext } from "../../../../Context/NotificationContext";

function Notice({ user_no }) {
  const currentUser_no = user_no;
  const { unreadCount, setUnreadCount } = useContext(NotificationContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/getNotification", {
          params: { user_no: currentUser_no },
        });
        const notiList = res.data.notifications;
        //console.log("클라 알림 목록 : ", notiList);

        if (notiList.length > 0) {
          setUnreadCount(notiList.filter((notif) => !notif.is_read).length); // 읽지 않은 알림 개수 설정
        }
      } catch (error) {
        console.error("알림 데이터를 불러오는 중 오류 발생: ", error);
      }
    };
    fetchNotifications();
  }, [currentUser_no, setUnreadCount]); // 의존성 배열에 currentUser_no만 포함

  return (
    <div className="notice">
      <div className="notice_alert">
        <NavLink
          to={"/myNotifications"}
          className="notice-NavLink-hover"
          style={({ isActive }) => ({
            fontWeight: isActive ? "bold" : "normal",
            color: isActive ? "#ffcd19" : "white",
            textDecoration: "none",
          })}
        >
          <div className="alert_icon">
            <FaRegBell className="FaRegBell" />
          </div>
          <div className="alert_text">알림</div>
        </NavLink>
        {unreadCount > 0 && (
          <div className="alert_number">
            <span>{unreadCount}</span>
          </div>
        )}
      </div>
      <NavLink
        to={`/Bookmark`}
        className="notice-NavLink-hover"
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
