import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { accessToken } = useContext(AuthContext);

    if (!accessToken) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
