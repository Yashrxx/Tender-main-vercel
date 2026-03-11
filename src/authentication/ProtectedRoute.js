import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(UserContext);

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;