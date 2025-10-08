import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';

// Импорт редьюсеров
import quantumMaterialsReducer from '@slices/quantum-materials-slice';
import fusionAssemblerReducer from '@slices/fusion-assembler-slice';
import phoenixTransactionsReducer from '@slices/phoenix-transactions-slice';
import auroraStreamReducer from '@slices/aurora-stream-slice';
import dragonHistoryReducer from '@slices/dragon-history-slice';
import crystalGatewayReducer from '@slices/crystal-gateway-slice';

// Создание корневого редьюсера
const applicationReducer = combineReducers({
  quantumMaterials: quantumMaterialsReducer,
  fusionAssembler: fusionAssemblerReducer,
  phoenixTransactions: phoenixTransactionsReducer,
  auroraStream: auroraStreamReducer,
  dragonHistory: dragonHistoryReducer,
  crystalGateway: crystalGatewayReducer
});

const applicationStore = configureStore({
  reducer: applicationReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    })
});

// Типы для TypeScript
export type ApplicationState = ReturnType<typeof applicationReducer>;
export type ApplicationDispatch = typeof applicationStore.dispatch;

// Кастомные хуки
export const useAppDispatch: () => ApplicationDispatch = () =>
  useReduxDispatch();
export const useAppSelector: TypedUseSelectorHook<ApplicationState> =
  useReduxSelector;

export default applicationStore;
