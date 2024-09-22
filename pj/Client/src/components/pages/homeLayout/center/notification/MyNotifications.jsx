import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./MyNotifications.css";
import { useContext, useEffect, useState } from "react";
import api from "../../../../auth/api";
import { AuthContext } from "../../../../../Context/AuthContext";
import NotiItem from "./NotiItem";
import { deleteNotifications } from "../../../../utills/NotificationService";

function MyNotifications() {
    const { userInfo } = useContext(AuthContext);
    const [notiList, setNotiList] = useState([]);
    const [selectedNotiIds, setSelectedNotiIds] = useState([]); // 선택된 알림 IDs 상태
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    //뒤로가기 기능
    const handleBack = () => {
        navigate(-1); //뒤로가기
    };

    useEffect(() => {
        const getNotification = async () => {
            try {
                const result = await api.get("/getNotification", {
                    params: {
                        user_no: userInfo.user_no,
                    },
                });
                const list = result.data.notifications;
                setNotiList(list);
            } catch (error) {
                console.log("알림 목록 가져오는 중 오류 ", error.message);
            } finally {
                setIsLoading(false);
            }
        };
        getNotification();
    }, [userInfo, notiList]);

    // 알림 체크박스 선택/해제 처리
    const handleSelectNotification = (id) => {
        if (selectedNotiIds.includes(id)) {
            setSelectedNotiIds(
                selectedNotiIds.filter((notiId) => notiId !== id)
            );
        } else {
            setSelectedNotiIds([...selectedNotiIds, id]);
        }
    };

    // 선택된 알림 삭제
    const handleDeleteNotifications = async () => {
        try {
            await deleteNotifications(selectedNotiIds);
            // 삭제된 알림 목록 필터링
            const updatedList = notiList.filter(
                (noti) => !selectedNotiIds.includes(noti.notification_id)
            );
            setNotiList(updatedList);
            setSelectedNotiIds([]); // 선택 초기화
        } catch (error) {
            console.log("알림 삭제 중 오류 ", error.message);
        }
    };

    return (
        <>
            <div className="notifications-header">
                <div className="BackIcon" onClick={handleBack}>
                    <IoMdArrowRoundBack />
                </div>
                <span>알림</span>
                {selectedNotiIds.length > 0 && (
                    <button onClick={handleDeleteNotifications}>삭제</button>
                )}
            </div>

            <div className="noti-container">
                {isLoading ? (
                    <p>로딩 중...</p>
                ) : (
                    <ul>
                        {notiList.length > 0 ? (
                            notiList.map((noti) => (
                                <li key={noti.notification_id}>
                                    <NotiItem
                                        {...noti}
                                        handleSelectNotification={
                                            handleSelectNotification
                                        }
                                        selectedNotiIds={selectedNotiIds}
                                    />
                                </li>
                            ))
                        ) : (
                            <p>알림이 없습니다.</p>
                        )}
                    </ul>
                )}
            </div>
        </>
    );
}

export default MyNotifications;
