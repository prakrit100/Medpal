import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('PrivateRoute - User:', user);
  console.log('PrivateRoute - Loading:', loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('PrivateRoute - Redirecting to landing page');
    return <Navigate to="/landing" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;