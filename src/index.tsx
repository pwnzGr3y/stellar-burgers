import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';
import App from '@components/app/app';
import applicationStore from '@services/store';
import { initializeGateway } from '@slices/crystal-gateway-slice';

// Получаем корневой элемент и создаем React root
const rootElement = document.getElementById('root') as HTMLElement;
const reactRoot = ReactDOMClient.createRoot(rootElement!);

// Инициализируем кристальный шлюз при загрузке приложения
applicationStore.dispatch(initializeGateway());

// Рендерим приложение
reactRoot.render(
  <React.StrictMode>
    <Provider store={applicationStore}>
      <App />
    </Provider>
  </React.StrictMode>
);
