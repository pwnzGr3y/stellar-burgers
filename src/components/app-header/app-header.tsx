import { FC } from 'react';
import { useAppSelector } from '@services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const { gatewayUser } = useAppSelector((state) => state.crystalGateway);

  return <AppHeaderUI userName={gatewayUser?.name || ''} />;
};
