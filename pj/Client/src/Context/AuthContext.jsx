// src/Context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../components/auth/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('accessToken');
            if (storedToken) {
                try {
                    // 서버에 토큰을 보내서 사용자 정보를 가져옴
                    const response = await api.post('/user-info', {
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
        };

        initializeAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/login', { username, password },{ withCredentials: true });
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
            await api.post('/logout', {}, { withCredentials: true });
        } catch (error) {
            console.error("로그아웃 에러:", error);
        } finally {
            // finally로 에러가 나더라도 로컬스토리지 초기화는 항상 수행
            localStorage.removeItem('accessToken');
            setAccessToken(null);
            setUserInfo(null);
        }
    };


    return (
        <AuthContext.Provider value={{ accessToken, userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
