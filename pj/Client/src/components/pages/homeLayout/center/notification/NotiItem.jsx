import { useContext, useState } from "react";
import "./NotiItem.css";
import { MdOutlineFiberNew } from "react-icons/md";
import { readNotification } from "../../../../utills/NotificationService";
import { NotificationContext } from "../../../../../Context/NotificationContext";

function NotiItem({
    is_read,
    message,
    type,
    notification_id,
    handleSelectNotification,
    selectedNotiIds,
}) {
    const [isRead, setIsRead] = useState(is_read); // 읽음 상태 관리
    const { unreadCount, setUnreadCount } = useContext(NotificationContext);

    const handleIsRead = () => {
        if (!isRead) {
            setIsRead(true);
            const readNoti = async () => {
                await readNotification(notification_id);
            };
            readNoti();
            setUnreadCount(unreadCount - 1);
        }
    };

    return (
        <div className="noti-card" onMouseEnter={handleIsRead}>
            <p>{message}</p>
            <p>유형 : {type}</p>
            <div className="isRead">
                {/* 읽지 않았을 경우 new 표시, 읽었을 경우 체크박스 표시 */}
                {!isRead ? (
                    <MdOutlineFiberNew size={40} />
                ) : (
                    <input
                        type="checkbox"
                        checked={selectedNotiIds.includes(notification_id)}
                        onChange={() =>
                            handleSelectNotification(notification_id)
                        }
                    />
                )}
            </div>
        </div>
    );
}

export default NotiItem;
