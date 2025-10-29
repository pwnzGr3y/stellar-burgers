import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser, TRegisterData, TLoginData } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '@api';
import { setCookie, getCookie } from '@utils/cookie';

type TCrystalGatewayState = {
  gatewayUser: TUser | null;
  isGatewayActive: boolean;
  isProcessing: boolean;
  gatewayError: string | null;
};

export const initialCrystalState: TCrystalGatewayState = {
  gatewayUser: null,
  isGatewayActive: false,
  isProcessing: false,
  gatewayError: null
};

export const activateCrystalGateway = createAsyncThunk(
  'crystalGateway/activateCrystalGateway',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const authenticateThroughGateway = createAsyncThunk(
  'crystalGateway/authenticateThroughGateway',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const deactivateCrystalGateway = createAsyncThunk(
  'crystalGateway/deactivateCrystalGateway',
  async () => {
    await logoutApi();
    localStorage.removeItem('refreshToken');
    setCookie('accessToken', '', { expires: -1 });
  }
);

export const retrieveGatewayUser = createAsyncThunk(
  'crystalGateway/retrieveGatewayUser',
  async () => {
    const response = await getUserApi();
    return response.user;
  }
);

export const updateGatewayUser = createAsyncThunk(
  'crystalGateway/updateGatewayUser',
  async (data: { name: string; email: string; password: string }) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const initiatePasswordRecovery = createAsyncThunk(
  'crystalGateway/initiatePasswordRecovery',
  async (email: string) => {
    await forgotPasswordApi({ email });
    return email;
  }
);

export const completePasswordRecovery = createAsyncThunk(
  'crystalGateway/completePasswordRecovery',
  async (data: { password: string; token: string }) => {
    await resetPasswordApi(data);
  }
);

const crystalGatewaySlice = createSlice({
  name: 'crystalGateway',
  initialState: initialCrystalState,
  reducers: {
    clearGatewayError: (state) => {
      state.gatewayError = null;
    },
    initializeGateway: (state) => {
      state.isGatewayActive = !!getCookie('accessToken');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(activateCrystalGateway.pending, (state) => {
        state.isProcessing = true;
        state.gatewayError = null;
      })
      .addCase(activateCrystalGateway.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.gatewayUser = action.payload || null;
        state.isGatewayActive = true;
      })
      .addCase(activateCrystalGateway.rejected, (state, action) => {
        state.isProcessing = false;
        state.gatewayError =
          action.error?.message || 'Ошибка активации кристального шлюза';
      })
      .addCase(authenticateThroughGateway.pending, (state) => {
        state.isProcessing = true;
        state.gatewayError = null;
      })
      .addCase(authenticateThroughGateway.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.gatewayUser = action.payload || null;
        state.isGatewayActive = true;
      })
      .addCase(authenticateThroughGateway.rejected, (state, action) => {
        state.isProcessing = false;
        state.gatewayError =
          action.error?.message || 'Ошибка аутентификации через шлюз';
      })
      .addCase(deactivateCrystalGateway.pending, (state) => {
        state.isProcessing = true;
        state.gatewayError = null;
      })
      .addCase(deactivateCrystalGateway.fulfilled, (state) => {
        state.isProcessing = false;
        state.gatewayUser = null;
        state.isGatewayActive = false;
      })
      .addCase(deactivateCrystalGateway.rejected, (state, action) => {
        state.isProcessing = false;
        state.gatewayError =
          action.error?.message || 'Ошибка деактивации шлюза';
      })
      .addCase(retrieveGatewayUser.pending, (state) => {
        state.isProcessing = true;
        state.gatewayError = null;
      })
      .addCase(retrieveGatewayUser.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.gatewayUser = action.payload || null;
        state.isGatewayActive = true;
      })
      .addCase(retrieveGatewayUser.rejected, (state, action) => {
        state.isProcessing = false;
        state.gatewayError =
          action.error?.message || 'Ошибка получения пользователя шлюза';
      })
      .addCase(updateGatewayUser.pending, (state) => {
        state.isProcessing = true;
        state.gatewayError = null;
      })
      .addCase(updateGatewayUser.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.gatewayUser = action.payload || null;
      })
      .addCase(updateGatewayUser.rejected, (state, action) => {
        state.isProcessing = false;
        state.gatewayError =
          action.error?.message || 'Ошибка обновления пользователя шлюза';
      })
      .addCase(initiatePasswordRecovery.pending, (state) => {
        state.isProcessing = true;
        state.gatewayError = null;
      })
      .addCase(initiatePasswordRecovery.fulfilled, (state) => {
        state.isProcessing = false;
      })
      .addCase(initiatePasswordRecovery.rejected, (state, action) => {
        state.isProcessing = false;
        state.gatewayError =
          action.error?.message || 'Ошибка инициации восстановления пароля';
      })
      .addCase(completePasswordRecovery.pending, (state) => {
        state.isProcessing = true;
        state.gatewayError = null;
      })
      .addCase(completePasswordRecovery.fulfilled, (state) => {
        state.isProcessing = false;
      })
      .addCase(completePasswordRecovery.rejected, (state, action) => {
        state.isProcessing = false;
        state.gatewayError =
          action.error?.message || 'Ошибка завершения восстановления пароля';
      });
  }
});

export const { clearGatewayError, initializeGateway } =
  crystalGatewaySlice.actions;
export default crystalGatewaySlice.reducer;
