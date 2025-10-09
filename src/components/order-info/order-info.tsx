import { FC, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@services/store';
import { Preloader } from '@ui/preloader';
import { OrderInfoUI } from '@ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { retrievePhoenixTransaction } from '@slices/phoenix-transactions-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { activeTransaction: orderData, isProcessing: isLoading } =
    useAppSelector((state) => state.phoenixTransactions);
  const { materials: ingredients } = useAppSelector(
    (state) => state.quantumMaterials
  );

  const orderFromFeed = useAppSelector((state) =>
    state.auroraStream.streamData.find(
      (order: TOrder) => order.number === Number(number)
    )
  );
  const orderFromProfile = useAppSelector((state) =>
    state.dragonHistory.historicalRecords.find(
      (order: TOrder) => order.number === Number(number)
    )
  );

  useEffect(() => {
    if (!orderFromFeed && !orderFromProfile && number) {
      dispatch(retrievePhoenixTransaction(Number(number)));
    }
  }, [dispatch, number, orderFromFeed, orderFromProfile]);

  const orderDataToUse = orderFromFeed || orderFromProfile || orderData;

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderDataToUse || !ingredients.length) return null;

    const date = new Date(orderDataToUse.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderDataToUse.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const totalCount = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...orderDataToUse,
      ingredientsInfo,
      date,
      totalCount,
      total: totalCount
    };
  }, [orderDataToUse, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
