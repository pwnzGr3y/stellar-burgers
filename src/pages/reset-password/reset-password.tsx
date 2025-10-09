import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@services/store';

import { ResetPasswordUI } from '@ui-pages';
import {
  completePasswordRecovery,
  clearGatewayError
} from '@slices/crystal-gateway-slice';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const { isProcessing: isLoading, gatewayError: errorMessage } =
    useAppSelector((state) => state.crystalGateway);

  useEffect(() => {
    dispatch(clearGatewayError());
    if (!localStorage.getItem('completePasswordRecovery')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate, dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(completePasswordRecovery({ password, token }))
      .unwrap()
      .then(() => {
        localStorage.removeItem('completePasswordRecovery');
        navigate('/login');
      })
      .catch(() => {});
  };

  return (
    <ResetPasswordUI
      errorText={errorMessage || ''}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
