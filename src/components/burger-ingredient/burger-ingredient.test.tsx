import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BurgerIngredient } from './burger-ingredient';
import fusionAssemblerReducer from '@slices/fusion-assembler-slice';
import { TIngredient } from '@utils-types';

// Mock UI компонента
jest.mock('@ui', () => ({
  BurgerIngredientUI: ({
    ingredient,
    count,
    handleAdd
  }: {
    ingredient: TIngredient;
    count: number;
    handleAdd: () => void;
  }) => (
    <div data-testid='burger-ingredient'>
      <div data-testid='ingredient-name'>{ingredient.name}</div>
      <div data-testid='ingredient-price'>{ingredient.price}</div>
      <div data-testid='ingredient-count'>{count}</div>
      <button onClick={handleAdd} data-testid='add-button'>
        Добавить
      </button>
    </div>
  )
}));

describe('BurgerIngredient', () => {
  const mockIngredient: TIngredient = {
    _id: 'test-ingredient-1',
    name: 'Тестовый ингредиент',
    type: 'main',
    proteins: 100,
    fat: 50,
    carbohydrates: 75,
    calories: 500,
    price: 250,
    image: 'test-image.png',
    image_large: 'test-image-large.png',
    image_mobile: 'test-image-mobile.png'
  };

  const createMockStore = () =>
    configureStore({
      reducer: {
        fusionAssembler: fusionAssemblerReducer
      }
    });

  const renderWithProviders = (
    component: React.ReactElement,
    store = createMockStore()
  ) =>
    render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    );

  it('должен рендерить компонент с данными ингредиента', () => {
    renderWithProviders(
      <BurgerIngredient ingredient={mockIngredient} count={0} />
    );

    expect(screen.getByTestId('ingredient-name')).toHaveTextContent(
      'Тестовый ингредиент'
    );
    expect(screen.getByTestId('ingredient-price')).toHaveTextContent('250');
  });

  it('должен отображать правильное количество ингредиента', () => {
    renderWithProviders(
      <BurgerIngredient ingredient={mockIngredient} count={3} />
    );

    expect(screen.getByTestId('ingredient-count')).toHaveTextContent('3');
  });

  it('должен добавить ингредиент в конструктор при клике на кнопку', () => {
    const store = createMockStore();
    renderWithProviders(
      <BurgerIngredient ingredient={mockIngredient} count={0} />,
      store
    );

    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);

    const state = store.getState();
    expect(state.fusionAssembler.assemblyComponents).toHaveLength(1);
    expect(state.fusionAssembler.assemblyComponents[0]._id).toBe(
      'test-ingredient-1'
    );
  });

  it('должен добавить булку в primaryComponent', () => {
    const bunIngredient: TIngredient = {
      ...mockIngredient,
      _id: 'bun-1',
      name: 'Тестовая булка',
      type: 'bun'
    };

    const store = createMockStore();
    renderWithProviders(
      <BurgerIngredient ingredient={bunIngredient} count={0} />,
      store
    );

    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);

    const state = store.getState();
    expect(state.fusionAssembler.primaryComponent).not.toBeNull();
    expect(state.fusionAssembler.primaryComponent?._id).toBe('bun-1');
  });

  it('должен создать уникальный id для каждого добавления', () => {
    const store = createMockStore();
    renderWithProviders(
      <BurgerIngredient ingredient={mockIngredient} count={0} />,
      store
    );

    const addButton = screen.getByTestId('add-button');

    // Добавляем один и тот же ингредиент дважды
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    const state = store.getState();
    expect(state.fusionAssembler.assemblyComponents).toHaveLength(2);

    const ids = state.fusionAssembler.assemblyComponents.map((item) => item.id);
    expect(ids[0]).not.toBe(ids[1]); // Уникальные id
  });

  it('не должен добавить невалидный ингредиент', () => {
    const invalidIngredient = {
      ...mockIngredient,
      _id: ''
    };

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const store = createMockStore();

    renderWithProviders(
      <BurgerIngredient ingredient={invalidIngredient} count={0} />,
      store
    );

    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);

    const state = store.getState();
    expect(state.fusionAssembler.assemblyComponents).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('не должен выбросить ошибку при клике на кнопку добавления', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    renderWithProviders(
      <BurgerIngredient ingredient={mockIngredient} count={0} />
    );

    const addButton = screen.getByTestId('add-button');
    expect(() => fireEvent.click(addButton)).not.toThrow();

    consoleErrorSpy.mockRestore();
  });
});
