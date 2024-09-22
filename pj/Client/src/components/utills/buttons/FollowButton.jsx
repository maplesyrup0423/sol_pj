import { useEffect, useState } from "react";
import "./FollowButton.css";
import { RiUserFollowLine, RiUserUnfollowFill } from "react-icons/ri";
import Swal from "sweetalert2";
import { unfollowUser, followUser, getFollowers } from "../FollowService";
import { createNotification } from "../NotificationService";
const FollowButton = ({ userInfo, followingNo, initialIsFollowing }) => {
    const followerNo = userInfo.user_no;

    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

    //console.log(initialIsFollowing, " 팔로우버튼 진입 , 처음 팔로우 여부");
    // initialIsFollowing이 변경되면 isFollowing도 업데이트
    useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);

    const handleFollow = async () => {
        if (followerNo === followingNo) {
            Swal.fire({
                title: "팔로우 취소",
                text: "자기 자신을 팔로우 할 수 없습니다.",
                icon: "info",
                confirmButtonText: "확인",
            });
            return;
        }

        try {
            if (isFollowing) {
                Swal.fire({
                    title: "팔로우 취소",
                    text: "팔로우를 취소하시겠습니까?",
                    icon: "question",
                    confirmButtonText: "예",
                    showCancelButton: true,
                    cancelButtonText: "아니오",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        unfollowUser(followerNo, followingNo);
                        setIsFollowing(false);
                        await getFollowers(followerNo);
                    }
                });
            } else {
                followUser(followerNo, followingNo);
                setIsFollowing(true);
                await getFollowers(followerNo);
                await createNotification(
                    followingNo,
                    `${userInfo.nickname}님이 당신을 팔로우 했습니다.`,
                    "follow"
                );
            }
        } catch (error) {
            console.error("팔로우/언팔로우 에러:", error);
        }
    };

    return (
        <div key={isFollowing} onClick={handleFollow} className="followBtn">
            {isFollowing ? (
                <RiUserUnfollowFill size={30} />
            ) : (
                <RiUserFollowLine size={30} />
            )}
        </div>
    );
};

export default FollowButton;
