const express = require("express");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");

module.exports = (conn) => {
    const router = express.Router(); // 여기에 router 선언

    //팔로워 목록 불러오는 함수
    router.get("/followers", async (req, res) => {
        const user_no = req.query.user_no;
        const followerQuery = `SELECT 
            u.user_id AS following_id,
            up.nickname AS following_nickname
        FROM 
            UserFollower uf
        JOIN 
            User u ON uf.following_no = u.user_no
        JOIN 
            UserProfile up ON u.user_no = up.user_no
        WHERE 
            uf.follower_no = ?`;

        conn.query(followerQuery, [user_no], (err, results) => {
            if (err) {
                console.log("팔로워 조회 중 에러 발생:", err);
                res.status(500).json({ success: false, message: "서버 오류" });
            } else {
                // console.log("팔로워 조회 결과 : ", results);
                res.json({ success: true, followers: results });
            }
        });
    });

    router.get("/chatFollowers", async (req, res) => {
        const user_no = req.query.user_no;

        // 팔로워 정보 조회
        const followerQuery = `SELECT 
            u.user_id AS follower_id,
            up.nickname AS follower_nickname
        FROM 
            UserFollower uf
        JOIN 
            User u ON uf.follower_no = u.user_no
        JOIN 
            UserProfile up ON u.user_no = up.user_no
        WHERE 
            uf.following_no = ?`;

        // 팔로잉 정보 조회
        const followingQuery = `SELECT 
            u.user_id AS following_id,
            up.nickname AS following_nickname,
            up.image_url AS following_image
        FROM 
            UserFollower uf
        JOIN 
            User u ON uf.following_no = u.user_no
        JOIN 
            UserProfile up ON u.user_no = up.user_no
        WHERE 
            uf.follower_no = ?`;

        try {
            conn.query(
                followerQuery,
                [user_no],
                (followerErr, followerResults) => {
                    if (followerErr) {
                        console.log("팔로워 조회 중 에러 발생:", followerErr);
                        return res
                            .status(500)
                            .json({ success: false, message: "서버 오류" });
                    }

                    conn.query(
                        followingQuery,
                        [user_no],
                        (followingErr, followingResults) => {
                            if (followingErr) {
                                console.log(
                                    "팔로잉 조회 중 에러 발생:",
                                    followingErr
                                );
                                return res.status(500).json({
                                    success: false,
                                    message: "서버 오류",
                                });
                            }

                            // 팔로워와 팔로잉 데이터를 함께 응답
                            res.json({
                                success: true,
                                followers: followerResults,
                                followings: followingResults,
                            });
                        }
                    );
                }
            );
        } catch (err) {
            console.log("서버 오류 발생:", err);
            res.status(500).json({ success: false, message: "서버 오류" });
        }
    });

    router.post("/follow", async (req, res) => {
        const { followerNo, followingNo } = req.body;

        const checkDuplicateQuery = `
          SELECT * FROM UserFollower WHERE follower_no = ? AND following_no = ?
        `;

        const insertFollowerQuery = `
          INSERT INTO UserFollower (follower_no, following_no) VALUES (?, ?)
        `;

        conn.query(
            checkDuplicateQuery,
            [followerNo, followingNo],
            (err, results) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ success: false, message: "서버 오류" });
                }

                // 이미 팔로우 상태인 경우
                if (results.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "이미 팔로우 중입니다.",
                    });
                }

                // 팔로우 삽입
                conn.query(
                    insertFollowerQuery,
                    [followerNo, followingNo],
                    (err, results) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: "팔로우 중 오류 발생",
                            });
                        }
                        return res
                            .status(200)
                            .json({ success: true, message: "팔로우 성공" });
                    }
                );
            }
        );
    });

    router.post("/unfollow", async (req, res) => {
        const { followerNo, followingNo } = req.body;
        try {
            await conn.query(
                "DELETE FROM UserFollower WHERE follower_no = ? AND following_no = ?",
                [followerNo, followingNo]
            );
            res.status(200).json({ message: "언팔로우 성공" });
        } catch (error) {
            res.status(500).json({ message: "서버 에러" });
        }
    });

    router.get("/isFollowing", (req, res) => {
        const { followerNo, followingNo } = req.query; // req.query로 수정

        const query = `
            SELECT * FROM UserFollower WHERE follower_no = ? AND following_no = ?
        `;

        conn.query(query, [followerNo, followingNo], (error, results) => {
            if (error) {
                console.error("서버 에러: ", error);
                return res.status(500).json({ message: "서버 에러" });
            }

            if (results.length > 0) {
                res.status(200).json({ isFollowing: true });
            } else {
                res.status(200).json({ isFollowing: false });
            }
        });
    });

    return router; // router를 반환
};
