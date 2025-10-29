import crystalGatewayReducer, {
  activateCrystalGateway,
  authenticateThroughGateway,
  deactivateCrystalGateway,
  retrieveGatewayUser,
  updateGatewayUser,
  initiatePasswordRecovery,
  completePasswordRecovery,
  clearGatewayError,
  initializeGateway,
  initialCrystalState
} from './crystal-gateway-slice';
import { TUser } from '@utils-types';

// Mock getCookie
jest.mock('@utils/cookie', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

describe('crystal-gateway-slice', () => {

  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен вернуть начальное состояние', () => {
    expect(crystalGatewayReducer(undefined, { type: 'unknown' })).toEqual(
      initialCrystalState
    );
  });

  describe('clearGatewayError', () => {
    it('должен очистить ошибку', () => {
      const stateWithError = {
        ...initialCrystalState,
        gatewayError: 'Some error'
      };
      const state = crystalGatewayReducer(stateWithError, clearGatewayError());
      expect(state.gatewayError).toBe(null);
    });
  });

  describe('initializeGateway', () => {
    it('должен установить isGatewayActive в true если accessToken существует', () => {
      const { getCookie } = require('@utils/cookie');
      getCookie.mockReturnValue('some-token');

      const state = crystalGatewayReducer(initialCrystalState, initializeGateway());
      expect(state.isGatewayActive).toBe(true);
    });

    it('должен установить isGatewayActive в false если accessToken отсутствует', () => {
      const { getCookie } = require('@utils/cookie');
      getCookie.mockReturnValue(undefined);

      const state = crystalGatewayReducer(initialCrystalState, initializeGateway());
      expect(state.isGatewayActive).toBe(false);
    });
  });

  describe('activateCrystalGateway', () => {
    it('должен установить isProcessing в true при pending', () => {
      const action = { type: activateCrystalGateway.pending.type };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(true);
      expect(state.gatewayError).toBe(null);
    });

    it('должен активировать шлюз при fulfilled', () => {
      const action = {
        type: activateCrystalGateway.fulfilled.type,
        payload: mockUser
      };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.gatewayUser).toEqual(mockUser);
      expect(state.isGatewayActive).toBe(true);
    });

    it('должен установить ошибку при rejected', () => {
      const errorMessage = 'Registration failed';
      const action = {
        type: activateCrystalGateway.rejected.type,
        error: { message: errorMessage }
      };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.gatewayError).toBe(errorMessage);
    });

    it('должен установить стандартное сообщение об ошибке если сообщение не передано', () => {
      const action = {
        type: activateCrystalGateway.rejected.type,
        error: {}
      };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.gatewayError).toBe('Ошибка активации кристального шлюза');
    });
  });

  describe('authenticateThroughGateway', () => {
    it('должен установить isProcessing в true при pending', () => {
      const action = { type: authenticateThroughGateway.pending.type };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(true);
      expect(state.gatewayError).toBe(null);
    });

    it('должен аутентифицировать пользователя при fulfilled', () => {
      const action = {
        type: authenticateThroughGateway.fulfilled.type,
        payload: mockUser
      };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.gatewayUser).toEqual(mockUser);
      expect(state.isGatewayActive).toBe(true);
    });

    it('должен установить ошибку при rejected', () => {
      const errorMessage = 'Login failed';
      const action = {
        type: authenticateThroughGateway.rejected.type,
        error: { message: errorMessage }
      };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.gatewayError).toBe(errorMessage);
    });
  });

  describe('deactivateCrystalGateway', () => {
    const authenticatedState = {
      ...initialCrystalState,
      gatewayUser: mockUser,
      isGatewayActive: true
    };

    it('должен установить isProcessing в true при pending', () => {
      const action = { type: deactivateCrystalGateway.pending.type };
      const state = crystalGatewayReducer(authenticatedState, action);
      expect(state.isProcessing).toBe(true);
      expect(state.gatewayError).toBe(null);
    });

    it('должен деактивировать шлюз при fulfilled', () => {
      const action = { type: deactivateCrystalGateway.fulfilled.type };
      const state = crystalGatewayReducer(authenticatedState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.gatewayUser).toBe(null);
      expect(state.isGatewayActive).toBe(false);
    });

    it('должен установить ошибку при rejected', () => {
      const errorMessage = 'Logout failed';
      const action = {
        type: deactivateCrystalGateway.rejected.type,
        error: { message: errorMessage }
      };
      const state = crystalGatewayReducer(authenticatedState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.gatewayError).toBe(errorMessage);
    });
  });

  describe('retrieveGatewayUser', () => {
    it('должен установить isProcessing в true при pending', () => {
      const action = { type: retrieveGatewayUser.pending.type };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(true);
      expect(state.gatewayError).toBe(null);
    });

    it('должен загрузить данные пользователя при fulfilled', () => {
      const action = {
        type: retrieveGatewayUser.fulfilled.type,
        payload: mockUser
      };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.gatewayUser).toEqual(mockUser);
      expect(state.isGatewayActive).toBe(true);
    });

    it('должен установить ошибку при rejected', () => {
      const errorMessage = 'Failed to retrieve user';
      const action = {
        type: retrieveGatewayUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.gatewayError).toBe(errorMessage);
    });
  });

  describe('updateGatewayUser', () => {
    const authenticatedState = {
      ...initialCrystalState,
      gatewayUser: mockUser,
      isGatewayActive: true
    };

    it('должен установить isProcessing в true при pending', () => {
      const action = { type: updateGatewayUser.pending.type };
      const state = crystalGatewayReducer(authenticatedState, action);
      expect(state.isProcessing).toBe(true);
      expect(state.gatewayError).toBe(null);
    });

    it('должен обновить данные пользователя при fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = {
        type: updateGatewayUser.fulfilled.type,
        payload: updatedUser
      };
      const state = crystalGatewayReducer(authenticatedState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.gatewayUser).toEqual(updatedUser);
    });

    it('должен установить ошибку при rejected', () => {
      const errorMessage = 'Update failed';
      const action = {
        type: updateGatewayUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = crystalGatewayReducer(authenticatedState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.gatewayError).toBe(errorMessage);
    });
  });

  describe('initiatePasswordRecovery', () => {
    it('должен установить isProcessing в true при pending', () => {
      const action = { type: initiatePasswordRecovery.pending.type };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(true);
      expect(state.gatewayError).toBe(null);
    });

    it('должен завершить инициацию восстановления пароля при fulfilled', () => {
      const action = {
        type: initiatePasswordRecovery.fulfilled.type,
        payload: 'test@example.com'
      };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(false);
    });

    it('должен установить ошибку при rejected', () => {
      const errorMessage = 'Password recovery failed';
      const action = {
        type: initiatePasswordRecovery.rejected.type,
        error: { message: errorMessage }
      };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.gatewayError).toBe(errorMessage);
    });
  });

  describe('completePasswordRecovery', () => {
    it('должен установить isProcessing в true при pending', () => {
      const action = { type: completePasswordRecovery.pending.type };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(true);
      expect(state.gatewayError).toBe(null);
    });

    it('должен завершить восстановление пароля при fulfilled', () => {
      const action = { type: completePasswordRecovery.fulfilled.type };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(false);
    });

    it('должен установить ошибку при rejected', () => {
      const errorMessage = 'Password reset failed';
      const action = {
        type: completePasswordRecovery.rejected.type,
        error: { message: errorMessage }
      };
      const state = crystalGatewayReducer(initialCrystalState, action);
      expect(state.isProcessing).toBe(false);
      expect(state.gatewayError).toBe(errorMessage);
    });
  });
});
