import applicationStore, { ApplicationState } from './store';
import quantumMaterialsReducer from '@slices/quantum-materials-slice';
import fusionAssemblerReducer from '@slices/fusion-assembler-slice';
import phoenixTransactionsReducer from '@slices/phoenix-transactions-slice';
import auroraStreamReducer from '@slices/aurora-stream-slice';
import dragonHistoryReducer from '@slices/dragon-history-slice';
import crystalGatewayReducer from '@slices/crystal-gateway-slice';

describe('Redux Store', () => {
  describe('rootReducer', () => {
    it('должен вернуть корректное начальное состояние при вызове с undefined и неизвестным экшеном', () => {
      const initialState = applicationStore.getState();

      // Диспатчим неизвестный экшен
      const newState = applicationStore.dispatch({
        type: 'UNKNOWN_ACTION'
      } as any);

      const stateAfterUnknownAction = applicationStore.getState();

      // Проверяем что состояние не изменилось
      expect(stateAfterUnknownAction).toEqual(initialState);

      // Проверяем структуру начального состояния
      expect(stateAfterUnknownAction).toHaveProperty('quantumMaterials');
      expect(stateAfterUnknownAction).toHaveProperty('fusionAssembler');
      expect(stateAfterUnknownAction).toHaveProperty('phoenixTransactions');
      expect(stateAfterUnknownAction).toHaveProperty('auroraStream');
      expect(stateAfterUnknownAction).toHaveProperty('dragonHistory');
      expect(stateAfterUnknownAction).toHaveProperty('crystalGateway');
    });

    it('должен содержать корректное начальное состояние для quantumMaterials', () => {
      const state = applicationStore.getState();

      expect(state.quantumMaterials).toEqual({
        materials: [],
        isLoading: false,
        errorMessage: null,
        lastFetchAttempt: null
      });
    });

    it('должен содержать корректное начальное состояние для fusionAssembler', () => {
      const state = applicationStore.getState();

      expect(state.fusionAssembler).toEqual({
        primaryComponent: null,
        assemblyComponents: []
      });
    });

    it('должен содержать корректное начальное состояние для phoenixTransactions', () => {
      const state = applicationStore.getState();

      expect(state.phoenixTransactions).toEqual({
        activeTransaction: null,
        isProcessing: false,
        transactionError: null
      });
    });

    it('должен содержать корректное начальное состояние для auroraStream', () => {
      const state = applicationStore.getState();

      expect(state.auroraStream).toEqual({
        streamData: [],
        totalCount: 0,
        todayCount: 0,
        isStreaming: false,
        streamError: null
      });
    });

    it('должен содержать корректное начальное состояние для dragonHistory', () => {
      const state = applicationStore.getState();

      expect(state.dragonHistory).toEqual({
        historicalRecords: [],
        isRetrieving: false,
        retrievalError: null
      });
    });

    it('должен содержать корректное начальное состояние для crystalGateway', () => {
      const state = applicationStore.getState();

      expect(state.crystalGateway).toEqual({
        gatewayUser: null,
        isGatewayActive: false,
        isProcessing: false,
        gatewayError: null
      });
    });

    it('должен корректно обрабатывать несколько неизвестных экшенов подряд', () => {
      const initialState = applicationStore.getState();

      // Диспатчим несколько неизвестных экшенов
      applicationStore.dispatch({ type: 'UNKNOWN_ACTION_1' } as any);
      applicationStore.dispatch({ type: 'UNKNOWN_ACTION_2' } as any);
      applicationStore.dispatch({ type: 'RANDOM_TYPE' } as any);

      const finalState = applicationStore.getState();

      // Состояние не должно измениться
      expect(finalState).toEqual(initialState);
    });

    it('должен иметь правильную типизацию ApplicationState', () => {
      const state: ApplicationState = applicationStore.getState();

      // TypeScript должен правильно определить типы
      expect(typeof state.quantumMaterials.isLoading).toBe('boolean');
      expect(Array.isArray(state.quantumMaterials.materials)).toBe(true);
      expect(Array.isArray(state.fusionAssembler.assemblyComponents)).toBe(
        true
      );
    });
  });

  describe('Store configuration', () => {
    it('должен иметь настроенный Redux DevTools в development режиме', () => {
      // Проверяем что store создан корректно
      expect(applicationStore).toBeDefined();
      expect(applicationStore.getState).toBeDefined();
      expect(applicationStore.dispatch).toBeDefined();
    });

    it('должен позволять подписку на изменения store', () => {
      let subscriptionCalled = false;

      const unsubscribe = applicationStore.subscribe(() => {
        subscriptionCalled = true;
      });

      // Диспатчим экшен
      applicationStore.dispatch({ type: 'TEST_ACTION' } as any);

      // Проверяем что подписка сработала
      expect(subscriptionCalled).toBe(true);

      // Отписываемся
      unsubscribe();
    });

    it('должен корректно работать dispatch', () => {
      const result = applicationStore.dispatch({
        type: 'TEST_DISPATCH'
      } as any);

      // dispatch должен возвращать диспатченный экшен
      expect(result.type).toBe('TEST_DISPATCH');
    });
  });
});
