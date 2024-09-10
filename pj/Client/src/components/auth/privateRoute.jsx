// src/components/auth/privateRoute.js
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext'; // 상대 경로 확인

const PrivateRoute = ({ element }) => {
    const { accessToken } = useContext(AuthContext);

    if (!accessToken) {
        return <Navigate to="/login" />;
    }

    return element;
};

export default PrivateRoute;
