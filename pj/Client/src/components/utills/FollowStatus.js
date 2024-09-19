import api from "../auth/api";

const checkFollowStatus = async (followerNo, followingNo) => {
    try {
        const response = await api.get("/isFollowing", {
            params: { followerNo, followingNo },
        });

        return response.data.isFollowing; // 팔로우 상태 반환
    } catch (error) {
        console.error("팔로우 상태를 가져오는 중 오류 발생:", error);
        return false; // 에러 발생 시 기본적으로 팔로우 상태가 아니라고 가정
    }
};

export default checkFollowStatus;
