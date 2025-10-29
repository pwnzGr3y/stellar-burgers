import auroraStreamReducer, {
  activateAuroraStream,
  initialAuroraState
} from './aurora-stream-slice';
import { TOrder } from '@utils-types';

describe('aurora-stream-slice', () => {

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: 'done',
      name: 'Бургер 1',
      createdAt: '2024-01-01T12:00:00.000Z',
      updatedAt: '2024-01-01T12:05:00.000Z',
      number: 1001,
      ingredients: ['ing-1', 'ing-2']
    },
    {
      _id: '2',
      status: 'pending',
      name: 'Бургер 2',
      createdAt: '2024-01-01T13:00:00.000Z',
      updatedAt: '2024-01-01T13:05:00.000Z',
      number: 1002,
      ingredients: ['ing-3', 'ing-4']
    }
  ];

  const mockFeedsResponse = {
    orders: mockOrders,
    total: 1500,
    totalToday: 50
  };

  it('должен вернуть начальное состояние', () => {
    expect(auroraStreamReducer(undefined, { type: 'unknown' })).toEqual(
      initialAuroraState
    );
  });

  describe('activateAuroraStream', () => {
    it('должен установить isStreaming в true при pending', () => {
      const action = { type: activateAuroraStream.pending.type };
      const state = auroraStreamReducer(initialAuroraState, action);
      expect(state.isStreaming).toBe(true);
      expect(state.streamError).toBe(null);
    });

    it('должен загрузить данные ленты при fulfilled', () => {
      const action = {
        type: activateAuroraStream.fulfilled.type,
        payload: mockFeedsResponse
      };
      const state = auroraStreamReducer(initialAuroraState, action);
      expect(state.isStreaming).toBe(false);
      expect(state.streamData).toEqual(mockOrders);
      expect(state.totalCount).toBe(1500);
      expect(state.todayCount).toBe(50);
      expect(state.streamError).toBe(null);
    });

    it('должен обработать payload с отсутствующими полями', () => {
      const action = {
        type: activateAuroraStream.fulfilled.type,
        payload: {
          orders: mockOrders
          // total и totalToday отсутствуют
        }
      };
      const state = auroraStreamReducer(initialAuroraState, action);
      expect(state.streamData).toEqual(mockOrders);
      expect(state.totalCount).toBe(0);
      expect(state.todayCount).toBe(0);
    });

    it('должен обработать пустой массив заказов', () => {
      const action = {
        type: activateAuroraStream.fulfilled.type,
        payload: {
          orders: [],
          total: 0,
          totalToday: 0
        }
      };
      const state = auroraStreamReducer(initialAuroraState, action);
      expect(state.streamData).toEqual([]);
      expect(state.totalCount).toBe(0);
      expect(state.todayCount).toBe(0);
    });

    it('должен обработать null payload', () => {
      const action = {
        type: activateAuroraStream.fulfilled.type,
        payload: null
      };
      const state = auroraStreamReducer(initialAuroraState, action);
      expect(state.isStreaming).toBe(false);
      // Состояние не должно измениться при null payload
      expect(state.streamData).toEqual([]);
      expect(state.totalCount).toBe(0);
      expect(state.todayCount).toBe(0);
    });

    it('должен установить ошибку при rejected', () => {
      const errorMessage = 'Failed to fetch feeds';
      const action = {
        type: activateAuroraStream.rejected.type,
        error: { message: errorMessage }
      };
      const state = auroraStreamReducer(initialAuroraState, action);
      expect(state.isStreaming).toBe(false);
      expect(state.streamError).toBe(errorMessage);
    });

    it('должен установить стандартное сообщение об ошибке если сообщение не передано', () => {
      const action = {
        type: activateAuroraStream.rejected.type,
        error: {}
      };
      const state = auroraStreamReducer(initialAuroraState, action);
      expect(state.streamError).toBe('Ошибка активации аврора-потока');
    });
  });

  describe('обновление данных', () => {
    it('должен корректно обновить данные при повторной активации', () => {
      const firstResponse = {
        orders: [mockOrders[0]],
        total: 100,
        totalToday: 10
      };

      let state = auroraStreamReducer(initialAuroraState, {
        type: activateAuroraStream.fulfilled.type,
        payload: firstResponse
      });

      expect(state.streamData).toHaveLength(1);
      expect(state.totalCount).toBe(100);

      const secondResponse = {
        orders: mockOrders,
        total: 200,
        totalToday: 20
      };

      state = auroraStreamReducer(state, {
        type: activateAuroraStream.fulfilled.type,
        payload: secondResponse
      });

      expect(state.streamData).toHaveLength(2);
      expect(state.totalCount).toBe(200);
      expect(state.todayCount).toBe(20);
    });
  });
});
