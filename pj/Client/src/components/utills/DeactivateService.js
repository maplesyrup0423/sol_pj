import api from "../auth/api";

// 팔로우 상태 확인 함수
export const deactivateAccount = async (userInfo) => {
    try {
        const response = await api.post("/deactivate", {
            userInfo,
        });
        // console.log("비활성화 함수 진입 : ", response.data);
        return response.data;
    } catch (error) {
        console.error("계정 비활성화 중 오류 발생:", error);
    }
};

export const deactivateCheckPassword = async (userId, password) => {
    try {
        const response = await api.post("/deactivateCheckPassword", {
            user_id: userId,
            password,
        });
        return response.data.success;
    } catch (error) {
        console.error("비밀번호 검증 오류:", error);
        throw new Error("비밀번호 검증에 실패했습니다.");
    }
};
