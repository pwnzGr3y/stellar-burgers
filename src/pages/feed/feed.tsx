import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@services/store';
import { activateAuroraStream } from '@slices/aurora-stream-slice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const { streamData, isStreaming: isLoading } = useAppSelector(
    (state) => state.auroraStream
  );

  useEffect(() => {
    dispatch(activateAuroraStream());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(activateAuroraStream());
  };

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={streamData} handleGetFeeds={handleGetFeeds} />;
};
