import { useEffect, useState } from "react";
import "./FollowButton.css";
//import { RiUserFollowLine, RiUserUnfollowFill } from "react-icons/ri";
import Swal from "sweetalert2";
import { unfollowUser, followUser, getFollowers } from "../FollowService";
import { createNotification } from "../NotificationService";
import BasicButton from "./BasicButton";
const FollowButton = ({ userInfo, followingNo, initialIsFollowing }) => {
  const followerNo = userInfo.user_no;

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [btnText, setBtnText] = useState(isFollowing ? "팔로잉" : "팔로우");

  //console.log(initialIsFollowing, " 팔로우버튼 진입 , 처음 팔로우 여부");
  // initialIsFollowing이 변경되면 isFollowing도 업데이트
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
    setBtnText(initialIsFollowing ? "팔로잉" : "팔로우");
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
          title: "언팔로우 하시겠습니까?",
          text: "이 사용자의 게시물은 더 이상 알림으로 오지 않습니다.",
          icon: "question",
          confirmButtonText: "언팔로우",
          showCancelButton: true,
          cancelButtonText: "취소",
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
  const handleMouseEnter = () => {
    if (isFollowing) setBtnText("언팔로우");
  };

  const handleMouseLeave = () => {
    if (isFollowing) setBtnText("팔로잉");
  };

  return (
    <div
      key={isFollowing}
      className="followBtns"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <BasicButton
        btnOn={false}
        btnSize="bigButton"
        btnColor={isFollowing ? "unfollowBtn" : "followBtn"}
        action={handleFollow}
        btnText={btnText}
      />
    </div>
  );
};

export default FollowButton;
