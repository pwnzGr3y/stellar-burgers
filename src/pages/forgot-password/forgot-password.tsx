import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@services/store';

import { ForgotPasswordUI } from '@ui-pages';
import {
  initiatePasswordRecovery,
  clearGatewayError
} from '@slices/crystal-gateway-slice';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isProcessing: isLoading, gatewayError: errorMessage } =
    useAppSelector((state) => state.crystalGateway);

  useEffect(() => {
    dispatch(clearGatewayError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(initiatePasswordRecovery(email))
      .unwrap()
      .then(() => {
        localStorage.setItem('completePasswordRecovery', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch(() => {});
  };

  return (
    <ForgotPasswordUI
      errorText={errorMessage || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
