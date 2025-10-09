import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@services/store';
import { addComponentToAssembly } from '@slices/fusion-assembler-slice';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const { primaryComponent, assemblyComponents } = useAppSelector(
      (state) => state.fusionAssembler
    );

    const handleAdd = () => {
      try {
        if (!ingredient || !ingredient._id) {
          console.warn('Invalid ingredient:', ingredient);
          return;
        }
        const constructorIngredient = {
          ...ingredient,
          id: `${ingredient._id}-${Date.now()}-${Math.random()}`
        };
        const action = addComponentToAssembly(constructorIngredient);
        dispatch(action);
      } catch (errorMessage) {
        console.error('Error in handleAdd:', errorMessage);
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
