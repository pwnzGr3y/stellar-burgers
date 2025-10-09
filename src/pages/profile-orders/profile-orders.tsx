import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@services/store';
import { retrieveDragonHistory } from '@slices/dragon-history-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const { historicalRecords: streamData } = useAppSelector(
    (state) => state.dragonHistory
  );

  useEffect(() => {
    dispatch(retrieveDragonHistory());
  }, [dispatch]);

  return <ProfileOrdersUI orders={streamData} />;
};
