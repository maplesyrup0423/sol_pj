import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Link로 채팅방으로 이동
import api from "../../../../auth/api";
import { AuthContext } from "../../../../../Context/AuthContext";
import "./ChatFriendList.css";
import ProfileImg from "../../../../utills/ProfileImg";

function ChatFriendList() {
    const { userInfo } = useContext(AuthContext);
    const [followerList, setFollowerList] = useState([]);

    useEffect(() => {
        const followers = async () => {
            try {
                const response = await api.get("/chatFollowers", {
                    params: {
                        user_no: userInfo.user_no, // userInfo에서 user_no 가져오기
                    },
                });

                const data = response.data;
                // console.log("data 진입 ", data.followings);
                if (data.success) {
                    setFollowerList(data.followings); // followers 리스트 설정
                } else {
                    alert(
                        "유저 정보를 가져올 수 없습니다. 오류 메시지: " +
                            data.message
                    );
                }
            } catch (error) {
                console.error("유저 정보를 가져오는 중 오류 발생:", error);
            }
        };
        followers();
    }, [userInfo.user_no]);

    return (
        <div className="friendList">
            {followerList.map((follower) => (
                <Link
                    to={`/chatRoom/${follower.following_id}`}
                    key={follower.following_id}
                    style={{
                        textDecoration: "none", // 밑줄 제거
                        color: "inherit", // 기본 텍스트 색상 유지
                    }}
                >
                    <div className="friendItem">
                        <ProfileImg image_url={follower.following_image} />
                        {/* <img src={follower.following_image} /> */}
                        <span>{follower.following_nickname}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default ChatFriendList;
