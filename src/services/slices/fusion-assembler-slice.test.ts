import fusionAssemblerReducer, {
  addComponentToAssembly,
  removeComponentFromAssembly,
  rearrangeAssemblyComponents,
  resetFusionAssembler
} from './fusion-assembler-slice';
import { TConstructorIngredient } from '@utils-types';

describe('fusion-assembler-slice', () => {
  const originalWarn = console.warn;
  beforeAll(() => {
    console.warn = jest.fn();
  });
  afterAll(() => {
    console.warn = originalWarn;
  });

  const initialState = {
    primaryComponent: null,
    assemblyComponents: []
  };

  const mockBun: TConstructorIngredient = {
    _id: 'bun-1',
    id: 'unique-bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png'
  };

  const mockSauce: TConstructorIngredient = {
    _id: 'sauce-1',
    id: 'unique-sauce-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'sauce.png',
    image_large: 'sauce-large.png',
    image_mobile: 'sauce-mobile.png'
  };

  const mockMain: TConstructorIngredient = {
    _id: 'main-1',
    id: 'unique-main-1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'main.png',
    image_large: 'main-large.png',
    image_mobile: 'main-mobile.png'
  };

  it('должен вернуть начальное состояние', () => {
    expect(fusionAssemblerReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('addComponentToAssembly', () => {
    it('должен добавить булку в primaryComponent', () => {
      const state = fusionAssemblerReducer(
        initialState,
        addComponentToAssembly(mockBun)
      );
      expect(state.primaryComponent).toEqual(mockBun);
      expect(state.assemblyComponents).toEqual([]);
    });

    it('должен заменить булку при добавлении новой', () => {
      const stateWithBun = {
        primaryComponent: mockBun,
        assemblyComponents: []
      };
      const newBun = { ...mockBun, _id: 'bun-2', id: 'unique-bun-2' };
      const state = fusionAssemblerReducer(
        stateWithBun,
        addComponentToAssembly(newBun)
      );
      expect(state.primaryComponent).toEqual(newBun);
    });

    it('должен добавить соус в assemblyComponents', () => {
      const state = fusionAssemblerReducer(
        initialState,
        addComponentToAssembly(mockSauce)
      );
      expect(state.assemblyComponents).toHaveLength(1);
      expect(state.assemblyComponents[0]).toEqual(mockSauce);
    });

    it('должен добавить начинку в assemblyComponents', () => {
      const state = fusionAssemblerReducer(
        initialState,
        addComponentToAssembly(mockMain)
      );
      expect(state.assemblyComponents).toHaveLength(1);
      expect(state.assemblyComponents[0]).toEqual(mockMain);
    });

    it('должен добавить несколько компонентов', () => {
      let state = fusionAssemblerReducer(
        initialState,
        addComponentToAssembly(mockSauce)
      );
      state = fusionAssemblerReducer(state, addComponentToAssembly(mockMain));
      expect(state.assemblyComponents).toHaveLength(2);
    });

    it('не должен добавить невалидный компонент', () => {
      const invalidComponent = {
        ...mockSauce,
        _id: '',
        type: ''
      } as any;
      const state = fusionAssemblerReducer(
        initialState,
        addComponentToAssembly(invalidComponent)
      );
      expect(state).toEqual(initialState);
    });
  });

  describe('removeComponentFromAssembly', () => {
    it('должен удалить компонент по id', () => {
      const stateWithComponents = {
        primaryComponent: null,
        assemblyComponents: [mockSauce, mockMain]
      };
      const state = fusionAssemblerReducer(
        stateWithComponents,
        removeComponentFromAssembly('unique-sauce-1')
      );
      expect(state.assemblyComponents).toHaveLength(1);
      expect(state.assemblyComponents[0]).toEqual(mockMain);
    });

    it('не должен изменить состояние при удалении несуществующего компонента', () => {
      const stateWithComponents = {
        primaryComponent: null,
        assemblyComponents: [mockSauce]
      };
      const state = fusionAssemblerReducer(
        stateWithComponents,
        removeComponentFromAssembly('non-existent-id')
      );
      expect(state.assemblyComponents).toEqual([mockSauce]);
    });

    it('не должен изменить состояние при передаче пустого id', () => {
      const stateWithComponents = {
        primaryComponent: null,
        assemblyComponents: [mockSauce]
      };
      const state = fusionAssemblerReducer(
        stateWithComponents,
        removeComponentFromAssembly('')
      );
      expect(state).toEqual(stateWithComponents);
    });
  });

  describe('rearrangeAssemblyComponents', () => {
    const sauce2: TConstructorIngredient = {
      ...mockSauce,
      id: 'unique-sauce-2'
    };
    const stateWithMultipleComponents = {
      primaryComponent: null,
      assemblyComponents: [mockSauce, mockMain, sauce2]
    };

    it('должен переместить компонент с начала в конец', () => {
      const state = fusionAssemblerReducer(
        stateWithMultipleComponents,
        rearrangeAssemblyComponents({ fromIndex: 0, toIndex: 2 })
      );
      expect(state.assemblyComponents).toEqual([mockMain, sauce2, mockSauce]);
    });

    it('должен переместить компонент с конца в начало', () => {
      const state = fusionAssemblerReducer(
        stateWithMultipleComponents,
        rearrangeAssemblyComponents({ fromIndex: 2, toIndex: 0 })
      );
      expect(state.assemblyComponents).toEqual([sauce2, mockSauce, mockMain]);
    });

    it('не должен изменить состояние при невалидных индексах (отрицательные)', () => {
      const state = fusionAssemblerReducer(
        stateWithMultipleComponents,
        rearrangeAssemblyComponents({ fromIndex: -1, toIndex: 1 })
      );
      expect(state).toEqual(stateWithMultipleComponents);
    });

    it('не должен изменить состояние при невалидных индексах (вне диапазона)', () => {
      const state = fusionAssemblerReducer(
        stateWithMultipleComponents,
        rearrangeAssemblyComponents({ fromIndex: 0, toIndex: 10 })
      );
      expect(state).toEqual(stateWithMultipleComponents);
    });
  });

  describe('resetFusionAssembler', () => {
    it('должен сбросить состояние к начальному', () => {
      const stateWithData = {
        primaryComponent: mockBun,
        assemblyComponents: [mockSauce, mockMain]
      };
      const state = fusionAssemblerReducer(
        stateWithData,
        resetFusionAssembler()
      );
      expect(state).toEqual(initialState);
    });
  });
});
