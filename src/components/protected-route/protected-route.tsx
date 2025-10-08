import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@services/store';
import { ReactElement } from 'react';

type ProtectedRouteProps = {
  element: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  element,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const isGatewayActive = useAppSelector(
    (state) => state.crystalGateway.isGatewayActive
  );
  const location = useLocation();

  if (onlyUnAuth && isGatewayActive) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isGatewayActive) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};
