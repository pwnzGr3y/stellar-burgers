import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAppSelector, useAppDispatch } from '@services/store';
import { fetchQuantumMaterials } from '@slices/quantum-materials-slice';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '@ui/burger-ingredients';

export const BurgerIngredients: FC = () => {
  const dispatchAction = useAppDispatch();
  const { materials: ingredientsList, isLoading: isLoading } = useAppSelector(
    (state) => state.quantumMaterials
  );

  // Фильтрация ингредиентов по типам
  const bunIngredients = ingredientsList.filter((item) => item.type === 'bun');
  const mainIngredients = ingredientsList.filter(
    (item) => item.type === 'main'
  );
  const sauceIngredients = ingredientsList.filter(
    (item) => item.type === 'sauce'
  );

  useEffect(() => {
    if (ingredientsList.length === 0 && !isLoading) {
      dispatchAction(fetchQuantumMaterials());
    }
  }, [dispatchAction, ingredientsList.length, isLoading]);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return null;
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={bunIngredients}
      mains={mainIngredients}
      sauces={sauceIngredients}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
