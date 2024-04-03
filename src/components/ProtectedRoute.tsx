import React, { ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminOnly?: boolean; // accesible to amdin only or not
  isAdmin?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({
  isAuthenticated,
  adminOnly,
  isAdmin,
  children,
  redirect = '/',
}: Props) => {

  if (!isAuthenticated) return <Navigate to={redirect} />;

  if(adminOnly && !isAdmin) return <Navigate to={redirect} />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
