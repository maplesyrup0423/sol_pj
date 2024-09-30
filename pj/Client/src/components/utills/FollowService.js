import api from "../auth/api";

// 팔로우 상태 확인 함수
export const checkFollowStatus = async (followerNo, followingNo) => {
    try {
        const response = await api.get("/isFollowing", {
            params: { followerNo, followingNo },
        });
        //console.log("체크팔로우 함수 진입 : ", response.data);
        return response.data.isFollowing; // 팔로우 상태 반환
    } catch (error) {
        console.error("팔로우 상태를 가져오는 중 오류 발생:", error);
        return false; // 에러 발생 시 기본적으로 팔로우 상태가 아니라고 가정
    }
};

// 팔로워 목록 가져오는 함수
export const getFollowers = async (userNo) => {
    try {
        const response = await api.get("/followers", {
            params: { user_no: userNo },
        });

        const data = response.data;
        if (data.success) {
            // 팔로워 목록을 상태로 업데이트
            return data.followers;
        } else {
            alert(
                "유저 정보를 가져올 수 없습니다. 오류 메시지: " + data.message
            );
        }
    } catch (error) {
        console.error("유저 정보를 가져오는 중 오류 발생:", error);
    }
};

// 팔로잉 목록 가져오는 함수
export const getFollowing = async (userNo, setFollowingList) => {
    try {
        const response = await api.get("/following", {
            params: { user_no: userNo },
        });

        const data = response.data;
        if (data.success) {
            // 팔로잉 목록을 상태로 업데이트
            setFollowingList(data.following);
        } else {
            alert(
                "유저 정보를 가져올 수 없습니다. 오류 메시지: " + data.message
            );
        }
    } catch (error) {
        console.error("유저 정보를 가져오는 중 오류 발생:", error);
    }
};

// 팔로우 추가 함수
export const followUser = async (followerNo, followingNo) => {
    console.log(followerNo, followingNo, "팔로우 추가 함수 진입 : ");
    try {
        const response = await api.post("/follow", {
            followerNo: followerNo,
            followingNo: followingNo,
        });

        return response.data.success;
    } catch (error) {
        console.error("팔로우 중 오류 발생:", error);
        return false;
    }
};

// 팔로우 취소 함수
export const unfollowUser = async (followerNo, followingNo) => {
    try {
        const response = await api.post("/unfollow", {
            followerNo: followerNo,
            followingNo: followingNo,
        });

        return response.data.success;
    } catch (error) {
        console.error("언팔로우 중 오류 발생:", error);
        return false;
    }
};

export const followerIds = async (followerNo) => {
    try {
        const response = await api.get("/followerIds", {
            params: {
                followerNo,
            },
        });
        return response.data;
    } catch (error) {
        console.error("언팔로우 중 오류 발생:", error);
    }
};
