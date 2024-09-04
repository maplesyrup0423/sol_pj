import { useEffect, useState } from "react";
import FriendItem from "./FriendItem";
import "./FriendList.css";
import axios from "axios";
function FriendList({ user_no }) {
    console.log("친구목록의 user_no : ", user_no);

    useEffect(() => {
        // 서버에서 유저 정보를 가져오는 함수
        const followers = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/follower",
                    {
                        params: {
                            user_no: user_no || "", // user_id를 사용해 유저 정보를 가져옵니다
                        },
                    }
                );

                const data = response.data;

                if (data.success) {
                    console.log("user_no : " + user_no);
                } else {
                    alert(
                        "유저 정보를 가져올 수 없습니다. 오류 메시지: " +
                            data.message
                    ); // 오류 메시지 포함
                }
            } catch (error) {
                console.error("유저 정보를 가져오는 중 오류 발생:", error);
            }
        };
    }, []);
    const user = {
        name: "요한",
        user_no: 6,
        chatList: 2,
        friends: [
            {
                f_no: 1,
                f_name: "친구1",
                f_unread_count: 0,
            },
            {
                f_no: 2,
                f_name: "친구2",
                f_unread_count: 5,
            },
        ],
    };

    return (
        <div className="friendList">
            {user.friends.map((f) => (
                <FriendItem key={f.f_no} {...f} />
            ))}
        </div>
    );
}

export default FriendList;
