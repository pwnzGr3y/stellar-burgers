import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { ApplicationState } from '@services/store';

type TPhoenixTransactionsState = {
  activeTransaction: TOrder | null;
  isProcessing: boolean;
  transactionError: string | null;
};

const initialPhoenixState: TPhoenixTransactionsState = {
  activeTransaction: null,
  isProcessing: false,
  transactionError: null
};

export const initiatePhoenixTransaction = createAsyncThunk(
  'phoenixTransactions/initiatePhoenixTransaction',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

export const retrievePhoenixTransaction = createAsyncThunk(
  'phoenixTransactions/retrievePhoenixTransaction',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const phoenixTransactionsSlice = createSlice({
  name: 'phoenixTransactions',
  initialState: initialPhoenixState,
  reducers: {
    clearPhoenixTransaction: (state) => {
      state.activeTransaction = null;
      state.transactionError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePhoenixTransaction.pending, (state) => {
        state.isProcessing = true;
        state.transactionError = null;
      })
      .addCase(initiatePhoenixTransaction.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.activeTransaction = action.payload || null;
      })
      .addCase(initiatePhoenixTransaction.rejected, (state, action) => {
        state.isProcessing = false;
        state.transactionError =
          action.error?.message || 'Ошибка инициации феникс-транзакции';
      })
      .addCase(retrievePhoenixTransaction.pending, (state) => {
        state.isProcessing = true;
        state.transactionError = null;
      })
      .addCase(retrievePhoenixTransaction.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.activeTransaction = action.payload || null;
      })
      .addCase(retrievePhoenixTransaction.rejected, (state, action) => {
        state.isProcessing = false;
        state.transactionError =
          action.error?.message || 'Ошибка получения феникс-транзакции';
      });
  }
});

export const { clearPhoenixTransaction } = phoenixTransactionsSlice.actions;
export default phoenixTransactionsSlice.reducer;
