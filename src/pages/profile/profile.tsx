import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@services/store';
import {
  retrieveGatewayUser,
  updateGatewayUser,
  deactivateCrystalGateway
} from '@slices/crystal-gateway-slice';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const {
    gatewayUser,
    isProcessing: isLoading,
    gatewayError: errorMessage
  } = useAppSelector((state) => state.crystalGateway);

  const [formValue, setFormValue] = useState({
    name: gatewayUser?.name || '',
    email: gatewayUser?.email || '',
    password: ''
  });

  useEffect(() => {
    if (gatewayUser) {
      setFormValue((prevState) => ({
        ...prevState,
        name: gatewayUser.name || '',
        email: gatewayUser.email || ''
      }));
    } else {
      dispatch(retrieveGatewayUser());
    }
  }, [gatewayUser, dispatch]);

  const isFormChanged =
    formValue.name !== gatewayUser?.name ||
    formValue.email !== gatewayUser?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const updateData: { name?: string; email?: string; password?: string } = {};

    if (formValue.name !== gatewayUser?.name) updateData.name = formValue.name;
    if (formValue.email !== gatewayUser?.email)
      updateData.email = formValue.email;
    if (formValue.password) updateData.password = formValue.password;

    if (Object.keys(updateData).length > 0) {
      dispatch(updateGatewayUser(updateData as any))
        .unwrap()
        .then(() => {
          setFormValue((prev) => ({ ...prev, password: '' }));
        });
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: gatewayUser?.name || '',
      email: gatewayUser?.email || '',
      password: ''
    });
  };

  const handleLogout = () => {
    dispatch(deactivateCrystalGateway());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={errorMessage || undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
