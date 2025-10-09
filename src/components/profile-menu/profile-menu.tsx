import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '@services/store';
import { ProfileMenuUI } from '@ui';
import { deactivateCrystalGateway } from '@slices/crystal-gateway-slice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(deactivateCrystalGateway());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
