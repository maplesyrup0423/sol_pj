import { useEffect, useState } from "react";
import "./FollowButton.css";
import api from "../../auth/api";
import { RiUserFollowLine, RiUserUnfollowFill } from "react-icons/ri";
import Swal from "sweetalert2";

const FollowButton = ({ followerNo, followingNo, initialIsFollowing }) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

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
                        await api.post("/unfollow", {
                            followerNo,
                            followingNo,
                        });
                        setIsFollowing(false);
                    }
                });
            } else {
                await api.post("/follow", { followerNo, followingNo });
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("팔로우/언팔로우 에러:", error);
        }
    };

    return (
        <div key={isFollowing} onClick={handleFollow} className="followBtn">
            {isFollowing ? (
                <RiUserUnfollowFill size={27} />
            ) : (
                <RiUserFollowLine size={27} />
            )}
        </div>
    );
};

export default FollowButton;
