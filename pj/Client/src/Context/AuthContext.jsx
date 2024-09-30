// src/Context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../components/auth/api";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken")
    );
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [activeRoom, setActiveRoom] = useState(null); // activeRoom 상태 추가
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem("accessToken");
            if (storedToken) {
                try {
                    // 서버에 토큰을 보내서 사용자 정보를 가져옴
                    const response = await api.post(
                        "/user-info",
                        {},
                        {
                            headers: { Authorization: `Bearer ${storedToken}` },
                        }
                    );

                    if (response.data.success) {
                        setUserInfo(response.data.user);
                        setAccessToken(storedToken);
                    } else {
                        // 토큰이 유효하지 않거나 사용자 정보를 가져오는 데 실패한 경우
                        localStorage.removeItem("accessToken");
                        setAccessToken(null);
                        setUserInfo(null);
                    }
                } catch (error) {
                    console.error("토큰 검증 오류:", error);
                    localStorage.removeItem("accessToken");
                    setAccessToken(null);
                    setUserInfo(null);
                }
            }
            setLoading(false); // 유저 정보 로드 후 로딩 상태 해제
        };

        initializeAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post(
                "/api/login",
                { username, password },
                { withCredentials: true }
            );
            const { accessToken, user } = response.data;

            localStorage.setItem("accessToken", accessToken);
            setAccessToken(accessToken);
            setUserInfo(user);
            return response;
        } catch (error) {
            if (error.response) {
                // 서버에서 반환한 상태 코드와 메시지 확인
                if (error.response.status === 403) {
                    // 403 에러 처리: 휴면 계정 상태
                    return error.response;
                } else {
                    // 다른 상태 코드에 대한 일반 오류 처리
                    console.error("Login error:", error.response.data.message);
                    alert(error.response.data.message || "로그인 실패");
                }
            } else {
                // 서버로부터 응답이 없거나 네트워크 오류
                console.error("Login error:", error);
                alert("서버와 연결할 수 없습니다. 나중에 다시 시도하세요.");
            }
        }
    };

    const logout = async () => {
        try {
            await api.post("/api/logout", {}, { withCredentials: true });
        } catch (error) {
            console.error("로그아웃 에러:", error);
        } finally {
            localStorage.removeItem("accessToken");
            setAccessToken(null);
            setUserInfo(null);
        }
    };
    useEffect(() => {
        console.log("activeRoom 값 변경:", activeRoom);
    }, [activeRoom]);

    // 로딩이 끝날 때까지 자식 컴포넌트를 렌더링하지 않음
    if (loading) {
        return null; // 로딩 중엔 아무것도 렌더링하지 않음
    }

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                userInfo,
                setUserInfo,
                activeRoom,
                setActiveRoom,
                login,
                logout,
            }}
        >
            {children} {/* 로딩 후에만 자식 컴포넌트를 렌더링 */}
        </AuthContext.Provider>
    );
};
