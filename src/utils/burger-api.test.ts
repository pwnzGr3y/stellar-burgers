import {
  getIngredientsApi,
  getFeedsApi,
  getOrderByNumberApi,
  registerUserApi,
  loginUserApi
} from './burger-api';

// Mock global fetch
global.fetch = jest.fn();

describe('burger-api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getIngredientsApi', () => {
    it('должен успешно загрузить ингредиенты', async () => {
      const mockIngredients = [
        {
          _id: '1',
          name: 'Булка',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'bun.png',
          image_large: 'bun-large.png',
          image_mobile: 'bun-mobile.png'
        }
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockIngredients
        })
      });

      const result = await getIngredientsApi();

      expect(result).toEqual(mockIngredients);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/ingredients'),
        expect.any(Object)
      );
    });

    it('должен выбросить ошибку при неуспешном запросе', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Error'
        })
      });

      await expect(getIngredientsApi()).rejects.toEqual({
        success: false,
        message: 'Error'
      });
    });
  });

  describe('getFeedsApi', () => {
    it('должен успешно загрузить ленту заказов', async () => {
      const mockFeeds = {
        success: true,
        orders: [
          {
            _id: '1',
            status: 'done',
            name: 'Бургер',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: '2024-01-01T12:05:00.000Z',
            number: 1001,
            ingredients: ['ing-1']
          }
        ],
        total: 1000,
        totalToday: 50
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFeeds
      });

      const result = await getFeedsApi();

      expect(result).toEqual(mockFeeds);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/orders/all'),
        expect.any(Object)
      );
    });

    it('должен выбросить ошибку при неуспешном запросе', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false
        })
      });

      await expect(getFeedsApi()).rejects.toEqual({
        success: false
      });
    });
  });

  describe('getOrderByNumberApi', () => {
    it('должен успешно получить заказ по номеру', async () => {
      const mockOrderResponse = {
        success: true,
        orders: [
          {
            _id: '123',
            status: 'done',
            name: 'Тестовый бургер',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: '2024-01-01T12:05:00.000Z',
            number: 12345,
            ingredients: ['ing-1', 'ing-2']
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrderResponse
      });

      const result = await getOrderByNumberApi(12345);

      expect(result).toEqual(mockOrderResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/orders/12345'),
        expect.objectContaining({
          method: 'GET'
        })
      );
    });
  });

  describe('registerUserApi', () => {
    it('должен успешно зарегистрировать пользователя', async () => {
      const registerData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      };

      const mockResponse = {
        success: true,
        user: {
          email: 'test@example.com',
          name: 'Test User'
        },
        accessToken: 'Bearer token123',
        refreshToken: 'refresh123'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await registerUserApi(registerData);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(registerData)
        })
      );
    });

    it('должен выбросить ошибку при неуспешной регистрации', async () => {
      const registerData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'User already exists'
        })
      });

      await expect(registerUserApi(registerData)).rejects.toEqual({
        success: false,
        message: 'User already exists'
      });
    });
  });

  describe('loginUserApi', () => {
    it('должен успешно авторизовать пользователя', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse = {
        success: true,
        user: {
          email: 'test@example.com',
          name: 'Test User'
        },
        accessToken: 'Bearer token123',
        refreshToken: 'refresh123'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await loginUserApi(loginData);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(loginData)
        })
      );
    });

    it('должен выбросить ошибку при неверных учетных данных', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Invalid credentials'
        })
      });

      await expect(loginUserApi(loginData)).rejects.toEqual({
        success: false,
        message: 'Invalid credentials'
      });
    });
  });

  describe('checkResponse', () => {
    it('должен правильно обработать успешный ответ', async () => {
      const mockData = { success: true, data: [1, 2, 3] };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      const result = await getIngredientsApi();
      expect(result).toEqual([1, 2, 3]);
    });

    it('должен отклонить промис при ошибке сервера', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Server error'
        })
      });

      await expect(getIngredientsApi()).rejects.toBeDefined();
    });
  });
});
