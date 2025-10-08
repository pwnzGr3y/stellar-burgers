import { FC } from 'react';
import { useAppSelector } from '@services/store';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '@ui/feed-info';

const getOrders = (streamData: TOrder[], status: string): number[] =>
  streamData
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const { streamData, totalCount, todayCount } = useAppSelector(
    (state) => state.auroraStream
  );

  const readyOrders = getOrders(streamData, 'done');
  const pendingOrders = getOrders(streamData, 'pending');
  const createdOrders = getOrders(streamData, 'created');

  // Объединяем заказы "pending" и "created" в группу "В работе"
  const inWorkOrders = [...pendingOrders, ...createdOrders];

  const feed = {
    total: totalCount,
    totalToday: todayCount
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={inWorkOrders}
      feed={feed}
    />
  );
};
