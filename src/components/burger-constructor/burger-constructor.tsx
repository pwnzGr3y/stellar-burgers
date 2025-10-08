import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  initiatePhoenixTransaction,
  clearPhoenixTransaction
} from '@slices/phoenix-transactions-slice';
import { resetFusionAssembler } from '@slices/fusion-assembler-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { primaryComponent, assemblyComponents } = useAppSelector(
    (state) => state.fusionAssembler
  );
  const { isProcessing: orderRequest, activeTransaction: orderModalData } =
    useAppSelector((state) => state.phoenixTransactions);
  const { isGatewayActive } = useAppSelector((state) => state.crystalGateway);

  const constructorItems = {
    bun: primaryComponent,
    ingredients: assemblyComponents
  };

  const onOrderClick = () => {
    if (!primaryComponent || orderRequest) return;

    if (!isGatewayActive) {
      navigate('/login');
      return;
    }

    const orderIngredients = [
      primaryComponent._id,
      ...(assemblyComponents || []).map((ingredient) => ingredient._id),
      primaryComponent._id
    ];

    dispatch(initiatePhoenixTransaction(orderIngredients));
  };

  const closeOrderModal = () => {
    dispatch(clearPhoenixTransaction());
    dispatch(resetFusionAssembler());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients || []).reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
