import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { getFeedsApi } from '@api';

type TAuroraStreamState = {
  streamData: TOrdersData['orders'];
  totalCount: number;
  todayCount: number;
  isStreaming: boolean;
  streamError: string | null;
};

export const initialAuroraState: TAuroraStreamState = {
  streamData: [],
  totalCount: 0,
  todayCount: 0,
  isStreaming: false,
  streamError: null
};

export const activateAuroraStream = createAsyncThunk(
  'auroraStream/activateAuroraStream',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);

const auroraStreamSlice = createSlice({
  name: 'auroraStream',
  initialState: initialAuroraState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(activateAuroraStream.pending, (state) => {
        state.isStreaming = true;
        state.streamError = null;
      })
      .addCase(activateAuroraStream.fulfilled, (state, action) => {
        state.isStreaming = false;
        if (action.payload) {
          state.streamData = action.payload.orders || [];
          state.totalCount = action.payload.total || 0;
          state.todayCount = action.payload.totalToday || 0;
        }
      })
      .addCase(activateAuroraStream.rejected, (state, action) => {
        state.isStreaming = false;
        state.streamError =
          action.error?.message || 'Ошибка активации аврора-потока';
      });
  }
});

export default auroraStreamSlice.reducer;
