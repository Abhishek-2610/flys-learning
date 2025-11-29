import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  // 1. Not Logged In -> Go to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role Check (Optional) -> If user lacks permission, redirect
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="p-8 text-red-600 font-bold text-center">403 Forbidden: You do not have access to this page.</div>;
  }

  // 3. Authorized -> Render the page
  return <Outlet />;
};

export default ProtectedRoute;