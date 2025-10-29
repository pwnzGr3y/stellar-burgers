import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ProtectedRoute } from './protected-route';
import crystalGatewayReducer from '@slices/crystal-gateway-slice';

const mockElement = <div>Protected Content</div>;
const mockLoginPage = <div>Login Page</div>;
const mockHomePage = <div>Home Page</div>;

const createMockStore = (isGatewayActive: boolean) =>
  configureStore({
    reducer: {
      crystalGateway: crystalGatewayReducer
    },
    preloadedState: {
      crystalGateway: {
        gatewayUser: null,
        isGatewayActive,
        isProcessing: false,
        gatewayError: null
      }
    }
  });

describe('ProtectedRoute', () => {
  describe('для защищенных маршрутов (onlyUnAuth=false)', () => {
    it('должен рендерить защищенный контент для авторизованного пользователя', () => {
      const store = createMockStore(true);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route
                path='/protected'
                element={<ProtectedRoute element={mockElement} />}
              />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('должен перенаправить на /login для неавторизованного пользователя', () => {
      const store = createMockStore(false);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route
                path='/protected'
                element={<ProtectedRoute element={mockElement} />}
              />
              <Route path='/login' element={mockLoginPage} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('для маршрутов только для неавторизованных (onlyUnAuth=true)', () => {
    it('должен рендерить контент для неавторизованного пользователя', () => {
      const store = createMockStore(false);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <Routes>
              <Route
                path='/login'
                element={<ProtectedRoute element={mockLoginPage} onlyUnAuth />}
              />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('должен перенаправить на главную для авторизованного пользователя', () => {
      const store = createMockStore(true);

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/login']}>
            <Routes>
              <Route
                path='/login'
                element={<ProtectedRoute element={mockLoginPage} onlyUnAuth />}
              />
              <Route path='/' element={mockHomePage} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText('Home Page')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('должен перенаправить на страницу from из location.state', () => {
      const store = createMockStore(true);
      const fromPath = '/profile';

      render(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[
              { pathname: '/login', state: { from: { pathname: fromPath } } }
            ]}
          >
            <Routes>
              <Route
                path='/login'
                element={<ProtectedRoute element={mockLoginPage} onlyUnAuth />}
              />
              <Route path='/profile' element={<div>Profile Page</div>} />
              <Route path='/' element={mockHomePage} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText('Profile Page')).toBeInTheDocument();
    });
  });
});
