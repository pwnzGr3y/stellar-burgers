import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@services/store';
import { LoginUI } from '@ui-pages';
import {
  authenticateThroughGateway,
  clearGatewayError
} from '@slices/crystal-gateway-slice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isProcessing: isLoading, gatewayError: errorMessage } =
    useAppSelector((state) => state.crystalGateway);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    dispatch(clearGatewayError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(authenticateThroughGateway({ email, password }))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch(() => {});
  };

  return (
    <LoginUI
      errorText={errorMessage || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
