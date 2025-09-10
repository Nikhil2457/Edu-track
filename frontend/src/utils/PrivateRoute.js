import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ roles }) => {
  const { token, role } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(role)) return <Navigate to="/dashboard" />;
  return <Outlet />;
};
export default PrivateRoute;