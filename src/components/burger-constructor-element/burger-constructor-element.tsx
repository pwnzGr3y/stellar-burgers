import { FC, memo } from 'react';
import { useAppDispatch } from '@services/store';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  removeComponentFromAssembly,
  rearrangeAssemblyComponents
} from '@slices/fusion-assembler-slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useAppDispatch();

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(
          rearrangeAssemblyComponents({ fromIndex: index, toIndex: index + 1 })
        );
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(
          rearrangeAssemblyComponents({ fromIndex: index, toIndex: index - 1 })
        );
      }
    };

    const handleClose = () => {
      dispatch(removeComponentFromAssembly(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
