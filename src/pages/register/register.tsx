import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@services/store';
import { RegisterUI } from '@ui-pages';
import {
  activateCrystalGateway,
  clearGatewayError
} from '@slices/crystal-gateway-slice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isProcessing: isLoading, gatewayError: errorMessage } =
    useAppSelector((state) => state.crystalGateway);

  useEffect(() => {
    dispatch(clearGatewayError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(activateCrystalGateway({ name: userName, email, password }))
      .unwrap()
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch(() => {
        // Ошибка обрабатывается в slice
      });
  };

  return (
    <RegisterUI
      errorText={errorMessage || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
