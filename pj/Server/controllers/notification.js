const express = require("express");
const router = express.Router();

module.exports = (conn) => {
    router.get("/getNotification", async (req, res) => {
        const { user_no } = req.query;
        conn.query(
            "SELECT * FROM Notifications WHERE user_no = ?",
            [user_no],
            (err, result) => {
                if (err) {
                    console.log("알림 조회 중 오류 발생");
                    res.status(500).json({
                        success: false,
                        message: "서버 오류",
                    });
                } else {
                    res.json({ success: true, notifications: result });
                }
            }
        );
    });

    router.get("/createNotification", async (req, res) => {
        //console.log("서버 알림 추가 진입 : ", req.query.message);

        const { followingNo, message, type } = req.query;

        // type이 follow일 경우 검증 필요
        if (type === "follow") {
            // 현재 날짜를 확인 (하루 단위로 중복을 방지하기 위함)
            const today = new Date();
            const startOfDay = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                0,
                0,
                0
            );
            const endOfDay = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                23,
                59,
                59
            );

            // 같은 날에 이미 팔로우 알림이 있는지 확인
            conn.query(
                `SELECT * FROM notifications 
                 WHERE user_no = ? AND type = ? 
                 AND created_at BETWEEN ? AND ?`,
                [followingNo, type, startOfDay, endOfDay],
                (err, results) => {
                    if (err) {
                        console.log("알림 중복 체크 중 오류 발생");
                        res.status(500).json({
                            success: false,
                            message: "알림 중복 체크 오류",
                        });
                    } else if (results.length > 0) {
                        // 이미 알림이 있는 경우
                        console.log("중복된 팔로우 알림이 이미 존재합니다.");
                        res.status(200).json({
                            success: false,
                            message: "이미 오늘 팔로우 알림이 존재합니다.",
                        });
                    } else {
                        // 중복이 없는 경우 알림 추가
                        conn.query(
                            "INSERT INTO notifications (user_no, message, type) VALUES (?, ?, ?)",
                            [followingNo, message, type],
                            (err) => {
                                if (err) {
                                    console.log("알림 추가 중 오류 발생");
                                    res.status(500).json({
                                        success: false,
                                        message: "알림 추가 서버 오류",
                                    });
                                } else {
                                    res.status(200).json({
                                        success: true,
                                        message:
                                            "알림이 성공적으로 추가되었습니다.",
                                    });
                                }
                            }
                        );
                    }
                }
            );
        }
        // 타입이 새 글일 경우
        else if (type === "new_post") {
            //console.log("서버 new_post 진입 : ", req.query);

            const query = `SELECT follower_no FROM UserFollower WHERE following_no = ?`;
            conn.query(query, [followingNo], (err, followerIds) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "팔로워 목록 불러오는 중 오류 발생",
                    });
                }
                // 각 팔로워에게 알림 생성
                followerIds.forEach((follower) => {
                    //console.log("포이치 진입 : ", follower);
                    conn.query(
                        "INSERT INTO notifications (user_no, message, type) VALUES (?, ?, ?)",
                        [follower.follower_no, message, type]
                    );
                });
                return res.status(200).json({
                    success: true,
                    message: "팔로워들에게 알림 보내기 성공",
                });
            });
        } else if (type === "new_heart") {
            conn.query(
                "INSERT INTO notifications (user_no, message, type) VALUES (?, ?, ?)",
                [followingNo, message, type],
                (err) => {
                    if (err) {
                        console.log("알림 추가 중 오류 발생");
                        res.status(500).json({
                            success: false,
                            message: "알림 추가 서버 오류",
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: "알림이 성공적으로 추가되었습니다.",
                        });
                    }
                }
            );
        } else {
            // 다른 타입의 알림 처리 로직
            conn.query(
                "INSERT INTO notifications (user_no, message, type) VALUES (?, ?, ?)",
                [followingNo, message, type],
                (err) => {
                    if (err) {
                        console.log("알림 추가 중 오류 발생");
                        res.status(500).json({
                            success: false,
                            message: "알림 추가 서버 오류",
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: "알림이 성공적으로 추가되었습니다.",
                        });
                    }
                }
            );
        }
    });

    router.get("/readNotification", async (req, res) => {
        const { notification_id } = req.query;

        conn.query(
            "UPDATE notifications SET is_read = true WHERE notification_id = ?",
            [notification_id],
            (err) => {
                if (err) {
                    console.log("알림 읽음 처리중 오류 발생");
                    res.status(500).json({
                        success: false,
                        message: "알림 읽음 서버 오류",
                    });
                }
            }
        );
    });

    router.post("/deleteNotifications", async (req, res) => {
        const { notification_ids } = req.body;

        //console.log("서버 알림삭제 진입 : ", notification_ids);
        notification_ids.map((noti) =>
            conn.query(
                "DELETE FROM notifications WHERE notification_id = ?",
                [noti],
                (err) => {
                    if (err) {
                        console.log("알림 삭제 처리중 오류 발생");
                        res.status(500).json({
                            success: false,
                            message: "알림 삭제 서버 오류",
                        });
                    }
                }
            )
        );
    });

    return router;
};
