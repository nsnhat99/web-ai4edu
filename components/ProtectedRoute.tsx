import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isRestoringSession } = useAuth();
  const location = useLocation();

  // Chưa hỏi xong server thì chưa biết có phiên hay không; điều hướng sớm sẽ đẩy
  // admin ra trang login mỗi lần refresh trang quản trị.
  if (isRestoringSession) {
    return <LoadingSpinner />;
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
