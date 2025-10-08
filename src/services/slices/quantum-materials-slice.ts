import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

type TQuantumMaterialsState = {
  materials: TIngredient[];
  isLoading: boolean;
  errorMessage: string | null;
};

const initialQuantumState: TQuantumMaterialsState = {
  materials: [],
  isLoading: false,
  errorMessage: null
};

export const fetchQuantumMaterials = createAsyncThunk(
  'quantumMaterials/fetchQuantumMaterials',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

const quantumMaterialsSlice = createSlice({
  name: 'quantumMaterials',
  initialState: initialQuantumState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuantumMaterials.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchQuantumMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.materials = action.payload || [];
      })
      .addCase(fetchQuantumMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage =
          action.error?.message || 'Ошибка загрузки квантовых материалов';
      });
  }
});

export default quantumMaterialsSlice.reducer;
