import api from "../auth/api";

export const getNotifications = async (user_no) => {
    try {
        const response = await api.get("/getNotification", {
            params: { user_no: user_no },
        });
        return response.data;
    } catch (error) {
        console.log("알림을 가져오는 중 오류 발생", error.message);
    }
    return;
};

export const createNotification = async (followingNo, message, type) => {
    try {
        const response = await api.get("/createNotification", {
            params: { followingNo, message, type },
        });
        return response.data;
    } catch (error) {
        console.log("알림을 서버로 보내는 도중 오류 발생", error.message);
    }
    return;
};

export const readNotification = async (notification_id) => {
    try {
        await api.get("/readNotification", {
            params: {
                notification_id,
            },
        });
    } catch (error) {
        console.log("알림을 읽음 처리 도중 오류 발생", error.message);
    }
};

export const deleteNotifications = async (notifications) => {
    try {
        await api.post("/deleteNotifications", {
            notification_ids: notifications,
        });
    } catch (error) {
        console.log("알림을 삭제 처리 도중 오류 발생", error.message);
    }
};
