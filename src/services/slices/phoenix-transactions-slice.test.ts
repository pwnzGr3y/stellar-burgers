import phoenixTransactionsReducer, {
  initiatePhoenixTransaction,
  retrievePhoenixTransaction,
  clearPhoenixTransaction
} from './phoenix-transactions-slice';
import { TOrder } from '@utils-types';

describe('phoenix-transactions-slice', () => {
  const initialState = {
    activeTransaction: null,
    isProcessing: false,
    transactionError: null
  };

  const mockOrder: TOrder = {
    _id: '123',
    status: 'done',
    name: 'Флюоресцентный бургер',
    createdAt: '2024-01-01T12:00:00.000Z',
    updatedAt: '2024-01-01T12:05:00.000Z',
    number: 12345,
    ingredients: ['ingredient-1', 'ingredient-2', 'ingredient-3']
  };

  it('должен вернуть начальное состояние', () => {
    expect(phoenixTransactionsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('clearPhoenixTransaction', () => {
    it('должен очистить активную транзакцию и ошибку', () => {
      const stateWithData = {
        activeTransaction: mockOrder,
        isProcessing: false,
        transactionError: 'Some error'
      };
      const state = phoenixTransactionsReducer(
        stateWithData,
        clearPhoenixTransaction()
      );
      expect(state.activeTransaction).toBe(null);
      expect(state.transactionError).toBe(null);
      expect(state.isProcessing).toBe(false);
    });
  });

  describe('initiatePhoenixTransaction', () => {
    it('должен установить isProcessing в true при pending', () => {
      const action = { type: initiatePhoenixTransaction.pending.type };
      const state = phoenixTransactionsReducer(initialState, action);
      expect(state.isProcessing).toBe(true);
      expect(state.transactionError).toBe(null);
    });

    it('должен сохранить заказ при fulfilled', () => {
      const action = {
        type: initiatePhoenixTransaction.fulfilled.type,
        payload: mockOrder
      };
      const state = phoenixTransactionsReducer(initialState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.activeTransaction).toEqual(mockOrder);
      expect(state.transactionError).toBe(null);
    });

    it('должен обработать null payload при fulfilled', () => {
      const action = {
        type: initiatePhoenixTransaction.fulfilled.type,
        payload: null
      };
      const state = phoenixTransactionsReducer(initialState, action);
      expect(state.activeTransaction).toBe(null);
    });

    it('должен установить ошибку при rejected', () => {
      const errorMessage = 'Failed to create order';
      const action = {
        type: initiatePhoenixTransaction.rejected.type,
        error: { message: errorMessage }
      };
      const state = phoenixTransactionsReducer(initialState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.transactionError).toBe(errorMessage);
    });

    it('должен установить стандартное сообщение об ошибке если сообщение не передано', () => {
      const action = {
        type: initiatePhoenixTransaction.rejected.type,
        error: {}
      };
      const state = phoenixTransactionsReducer(initialState, action);
      expect(state.transactionError).toBe('Ошибка инициации феникс-транзакции');
    });
  });

  describe('retrievePhoenixTransaction', () => {
    it('должен установить isProcessing в true при pending', () => {
      const action = { type: retrievePhoenixTransaction.pending.type };
      const state = phoenixTransactionsReducer(initialState, action);
      expect(state.isProcessing).toBe(true);
      expect(state.transactionError).toBe(null);
    });

    it('должен загрузить заказ по номеру при fulfilled', () => {
      const action = {
        type: retrievePhoenixTransaction.fulfilled.type,
        payload: mockOrder
      };
      const state = phoenixTransactionsReducer(initialState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.activeTransaction).toEqual(mockOrder);
    });

    it('должен обработать null payload при fulfilled', () => {
      const action = {
        type: retrievePhoenixTransaction.fulfilled.type,
        payload: null
      };
      const state = phoenixTransactionsReducer(initialState, action);
      expect(state.activeTransaction).toBe(null);
    });

    it('должен установить ошибку при rejected', () => {
      const errorMessage = 'Order not found';
      const action = {
        type: retrievePhoenixTransaction.rejected.type,
        error: { message: errorMessage }
      };
      const state = phoenixTransactionsReducer(initialState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.transactionError).toBe(errorMessage);
    });

    it('должен установить стандартное сообщение об ошибке если сообщение не передано', () => {
      const action = {
        type: retrievePhoenixTransaction.rejected.type,
        error: {}
      };
      const state = phoenixTransactionsReducer(initialState, action);
      expect(state.transactionError).toBe('Ошибка получения феникс-транзакции');
    });
  });

  describe('последовательность действий', () => {
    it('должен корректно обработать создание заказа и очистку', () => {
      let state = phoenixTransactionsReducer(initialState, {
        type: initiatePhoenixTransaction.fulfilled.type,
        payload: mockOrder
      });
      expect(state.activeTransaction).toEqual(mockOrder);

      state = phoenixTransactionsReducer(state, clearPhoenixTransaction());
      expect(state.activeTransaction).toBe(null);
      expect(state.transactionError).toBe(null);
    });
  });
});
