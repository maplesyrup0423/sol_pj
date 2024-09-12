// src/Context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../components/auth/api';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('accessToken');
            if (storedToken) {
                try {
                    // 서버에 토큰을 보내서 사용자 정보를 가져옴
                    const response = await api.post('/user-info', {}, {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    });

                    if (response.data.success) {
                        setUserInfo(response.data.user);
                        setAccessToken(storedToken);
                    } else {
                        // 토큰이 유효하지 않거나 사용자 정보를 가져오는 데 실패한 경우
                        localStorage.removeItem('accessToken');
                        setAccessToken(null);
                        setUserInfo(null);
                    }
                } catch (error) {
                    console.error("토큰 검증 오류:", error);
                    localStorage.removeItem('accessToken');
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
            const response = await axios.post('/api/login', { username, password }, { withCredentials: true });
            const { accessToken, user } = response.data;

            localStorage.setItem('accessToken', accessToken);
            setAccessToken(accessToken);
            setUserInfo(user);
        } catch (error) {
            console.error("Login error:", error);
            throw new Error('로그인 실패');
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/logout', {}, { withCredentials: true });
        } catch (error) {
            console.error("로그아웃 에러:", error);
        } finally {
            localStorage.removeItem('accessToken');
            setAccessToken(null);
            setUserInfo(null);
        }
    };

    // 로딩이 끝날 때까지 자식 컴포넌트를 렌더링하지 않음
    if (loading) {
        return null; // 로딩 중엔 아무것도 렌더링하지 않음
    }

    return (
        <AuthContext.Provider value={{ accessToken, userInfo, setUserInfo, login, logout }}>
            {children} {/* 로딩 후에만 자식 컴포넌트를 렌더링 */}
        </AuthContext.Provider>
    );
};
