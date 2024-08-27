import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

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

    // 액세스 토큰이 만료되어 401 에러가 발생한 경우
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 리프레시 토큰을 사용하여 새 액세스 토큰 요청
        const response = await axios.post('/refresh-token');
        const newAccessToken = response.data.accessToken;

        // 새 액세스 토큰을 로컬 스토리지에 저장
        localStorage.setItem('accessToken', newAccessToken);

        // 새 액세스 토큰으로 헤더 업데이트
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // 원래 요청 재시도
        return api(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        localStorage.removeItem('accessToken');
        // 로그인 페이지로 리다이렉트 (예시)
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;