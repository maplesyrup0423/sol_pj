import api from "../auth/api";

// 팔로우 상태 확인 함수
export const deactivateAccount = async (userInfo) => {
    try {
        const response = await api.post("/deactivate", {
            userInfo,
        });
        console.log("비활성화 함수 진입 : ", response.data);
        return response.data;
    } catch (error) {
        console.error("계정 비활성화 중 오류 발생:", error);
    }
};
