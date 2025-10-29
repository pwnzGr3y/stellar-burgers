import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

type TDragonHistoryState = {
  historicalRecords: TOrder[];
  isRetrieving: boolean;
  retrievalError: string | null;
};

export const initialDragonState: TDragonHistoryState = {
  historicalRecords: [],
  isRetrieving: false,
  retrievalError: null
};

export const retrieveDragonHistory = createAsyncThunk(
  'dragonHistory/retrieveDragonHistory',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

const dragonHistorySlice = createSlice({
  name: 'dragonHistory',
  initialState: initialDragonState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveDragonHistory.pending, (state) => {
        state.isRetrieving = true;
        state.retrievalError = null;
      })
      .addCase(retrieveDragonHistory.fulfilled, (state, action) => {
        state.isRetrieving = false;
        state.historicalRecords = action.payload || [];
      })
      .addCase(retrieveDragonHistory.rejected, (state, action) => {
        state.isRetrieving = false;
        state.retrievalError =
          action.error?.message || 'Ошибка получения драконьей истории';
      });
  }
});

export default dragonHistorySlice.reducer;
