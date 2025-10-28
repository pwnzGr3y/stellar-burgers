import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

type TQuantumMaterialsState = {
  materials: TIngredient[];
  isLoading: boolean;
  errorMessage: string | null;
  lastFetchAttempt: number | null;
};

const initialQuantumState: TQuantumMaterialsState = {
  materials: [],
  isLoading: false,
  errorMessage: null,
  lastFetchAttempt: null
};

export const fetchQuantumMaterials = createAsyncThunk(
  'quantumMaterials/fetchQuantumMaterials',
  async () => await getIngredientsApi()
);

const quantumMaterialsSlice = createSlice({
  name: 'quantumMaterials',
  initialState: initialQuantumState,
  reducers: {
    clearError: (state) => {
      state.errorMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuantumMaterials.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
        state.lastFetchAttempt = Date.now();
      })
      .addCase(fetchQuantumMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.materials = action.payload || [];
        state.errorMessage = null;
      })
      .addCase(fetchQuantumMaterials.rejected, (state, action) => {
        state.isLoading = false;
        const errorMsg =
          action.error?.message || 'Ошибка загрузки квантовых материалов';

        if (!errorMsg.includes('Circuit breaker')) {
          console.error('[Quantum Materials]', errorMsg);
        }

        state.errorMessage = errorMsg;
      });
  }
});

export const { clearError } = quantumMaterialsSlice.actions;
export default quantumMaterialsSlice.reducer;
