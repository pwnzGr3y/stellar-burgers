import quantumMaterialsReducer, {
  fetchQuantumMaterials,
  initialQuantumState
} from './quantum-materials-slice';
import { TIngredient } from '@utils-types';

describe('quantum-materials-slice', () => {

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
    },
    {
      _id: '2',
      name: 'Соус Spicy-X',
      type: 'sauce',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
    }
  ];

  it('должен вернуть начальное состояние', () => {
    expect(quantumMaterialsReducer(undefined, { type: 'unknown' })).toEqual(
      initialQuantumState
    );
  });

  it('должен установить isLoading в true при fetchQuantumMaterials.pending', () => {
    const action = { type: fetchQuantumMaterials.pending.type };
    const state = quantumMaterialsReducer(initialQuantumState, action);
    expect(state.isLoading).toBe(true);
    expect(state.errorMessage).toBe(null);
  });

  it('должен загрузить материалы при fetchQuantumMaterials.fulfilled', () => {
    const action = {
      type: fetchQuantumMaterials.fulfilled.type,
      payload: mockIngredients
    };
    const state = quantumMaterialsReducer(initialQuantumState, action);
    expect(state.isLoading).toBe(false);
    expect(state.materials).toEqual(mockIngredients);
    expect(state.errorMessage).toBe(null);
  });

  it('должен обработать пустой массив материалов при fetchQuantumMaterials.fulfilled', () => {
    const action = {
      type: fetchQuantumMaterials.fulfilled.type,
      payload: null
    };
    const state = quantumMaterialsReducer(initialQuantumState, action);
    expect(state.materials).toEqual([]);
  });

  it('должен установить ошибку при fetchQuantumMaterials.rejected', () => {
    const errorMessage = 'Ошибка сети';
    const action = {
      type: fetchQuantumMaterials.rejected.type,
      error: { message: errorMessage }
    };
    const state = quantumMaterialsReducer(initialQuantumState, action);
    expect(state.isLoading).toBe(false);
    expect(state.errorMessage).toBe(errorMessage);
  });

  it('должен установить стандартное сообщение об ошибке, если сообщение не передано', () => {
    const action = {
      type: fetchQuantumMaterials.rejected.type,
      error: {}
    };
    const state = quantumMaterialsReducer(initialQuantumState, action);
    expect(state.errorMessage).toBe('Ошибка загрузки квантовых материалов');
  });
});
