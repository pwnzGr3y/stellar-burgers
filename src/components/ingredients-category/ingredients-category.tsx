import { forwardRef, useMemo } from 'react';
import { useAppSelector } from '@services/store';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '@ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { primaryComponent, assemblyComponents: constructorIngredients } =
    useAppSelector((state) => state.fusionAssembler);

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};
    if (constructorIngredients) {
      constructorIngredients.forEach((ingredient: TIngredient) => {
        if (!counters[ingredient._id]) counters[ingredient._id] = 0;
        counters[ingredient._id]++;
      });
    }
    if (primaryComponent) counters[primaryComponent._id] = 2;
    return counters;
  }, [primaryComponent, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
