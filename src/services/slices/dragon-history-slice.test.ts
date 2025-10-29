import dragonHistoryReducer, {
  retrieveDragonHistory,
  initialDragonState
} from './dragon-history-slice';
import { TOrder } from '@utils-types';

describe('dragon-history-slice', () => {

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: 'done',
      name: 'Астро бургер',
      createdAt: '2024-01-01T10:00:00.000Z',
      updatedAt: '2024-01-01T10:05:00.000Z',
      number: 5001,
      ingredients: ['ing-1', 'ing-2', 'ing-3']
    },
    {
      _id: '2',
      status: 'done',
      name: 'Космический бургер',
      createdAt: '2024-01-02T11:00:00.000Z',
      updatedAt: '2024-01-02T11:05:00.000Z',
      number: 5002,
      ingredients: ['ing-4', 'ing-5']
    },
    {
      _id: '3',
      status: 'pending',
      name: 'Галактический бургер',
      createdAt: '2024-01-03T12:00:00.000Z',
      updatedAt: '2024-01-03T12:05:00.000Z',
      number: 5003,
      ingredients: ['ing-6', 'ing-7', 'ing-8', 'ing-9']
    }
  ];

  it('должен вернуть начальное состояние', () => {
    expect(dragonHistoryReducer(undefined, { type: 'unknown' })).toEqual(
      initialDragonState
    );
  });

  describe('retrieveDragonHistory', () => {
    it('должен установить isRetrieving в true при pending', () => {
      const action = { type: retrieveDragonHistory.pending.type };
      const state = dragonHistoryReducer(initialDragonState, action);
      expect(state.isRetrieving).toBe(true);
      expect(state.retrievalError).toBe(null);
    });

    it('должен загрузить историю заказов при fulfilled', () => {
      const action = {
        type: retrieveDragonHistory.fulfilled.type,
        payload: mockOrders
      };
      const state = dragonHistoryReducer(initialDragonState, action);
      expect(state.isRetrieving).toBe(false);
      expect(state.historicalRecords).toEqual(mockOrders);
      expect(state.historicalRecords).toHaveLength(3);
      expect(state.retrievalError).toBe(null);
    });

    it('должен обработать пустой массив заказов', () => {
      const action = {
        type: retrieveDragonHistory.fulfilled.type,
        payload: []
      };
      const state = dragonHistoryReducer(initialDragonState, action);
      expect(state.isRetrieving).toBe(false);
      expect(state.historicalRecords).toEqual([]);
      expect(state.retrievalError).toBe(null);
    });

    it('должен обработать null payload', () => {
      const action = {
        type: retrieveDragonHistory.fulfilled.type,
        payload: null
      };
      const state = dragonHistoryReducer(initialDragonState, action);
      expect(state.isRetrieving).toBe(false);
      expect(state.historicalRecords).toEqual([]);
    });

    it('должен установить ошибку при rejected', () => {
      const errorMessage = 'Failed to fetch user orders';
      const action = {
        type: retrieveDragonHistory.rejected.type,
        error: { message: errorMessage }
      };
      const state = dragonHistoryReducer(initialDragonState, action);
      expect(state.isRetrieving).toBe(false);
      expect(state.retrievalError).toBe(errorMessage);
    });

    it('должен установить стандартное сообщение об ошибке если сообщение не передано', () => {
      const action = {
        type: retrieveDragonHistory.rejected.type,
        error: {}
      };
      const state = dragonHistoryReducer(initialDragonState, action);
      expect(state.retrievalError).toBe('Ошибка получения драконьей истории');
    });
  });

  describe('обновление истории', () => {
    it('должен заменить старую историю новой при повторной загрузке', () => {
      const firstOrders = [mockOrders[0]];
      let state = dragonHistoryReducer(initialDragonState, {
        type: retrieveDragonHistory.fulfilled.type,
        payload: firstOrders
      });

      expect(state.historicalRecords).toHaveLength(1);
      expect(state.historicalRecords[0].number).toBe(5001);

      state = dragonHistoryReducer(state, {
        type: retrieveDragonHistory.fulfilled.type,
        payload: mockOrders
      });

      expect(state.historicalRecords).toHaveLength(3);
      expect(state.historicalRecords).toEqual(mockOrders);
    });

    it('должен очистить ошибку при успешной повторной загрузке', () => {
      const stateWithError = {
        historicalRecords: [],
        isRetrieving: false,
        retrievalError: 'Previous error'
      };

      const state = dragonHistoryReducer(stateWithError, {
        type: retrieveDragonHistory.pending.type
      });

      expect(state.retrievalError).toBe(null);
    });
  });

  describe('различные статусы заказов', () => {
    it('должен корректно хранить заказы с разными статусами', () => {
      const action = {
        type: retrieveDragonHistory.fulfilled.type,
        payload: mockOrders
      };
      const state = dragonHistoryReducer(initialDragonState, action);

      const doneOrders = state.historicalRecords.filter(
        (order) => order.status === 'done'
      );
      const pendingOrders = state.historicalRecords.filter(
        (order) => order.status === 'pending'
      );

      expect(doneOrders).toHaveLength(2);
      expect(pendingOrders).toHaveLength(1);
    });
  });
});
