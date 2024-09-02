// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

let isRefreshing = false;
let refreshSubscribers = [];

// 리프레시 토큰이 성공적으로 갱신되면 대기 중인 요청들을 처리합니다.
const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach(callback => callback(newAccessToken));
  refreshSubscribers = [];
};

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 리프레시 토큰 요청 중이면 새로 생긴 요청은 큐에 추가
        return new Promise((resolve) => {
          refreshSubscribers.push((newAccessToken) => {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post('http://localhost:5000/refresh-token', {}, {
          withCredentials: true
        });
        const newAccessToken = response.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
        api.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;

        isRefreshing = false;
        onRefreshed(newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
