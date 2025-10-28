/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Устанавливает фейковые токены авторизации в localStorage и cookies
       * @example cy.setAuthTokens()
       */
      setAuthTokens(): Chainable<void>;

      /**
       * Очищает токены авторизации из localStorage и cookies
       * @example cy.clearAuthTokens()
       */
      clearAuthTokens(): Chainable<void>;

      /**
       * Перехватывает запросы к API и подставляет фикстуры
       * @example cy.interceptApi()
       */
      interceptApi(): Chainable<void>;
    }
  }
}

// Команда для установки фейковых токенов авторизации
Cypress.Commands.add('setAuthTokens', () => {
  cy.window().then((window) => {
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
  });
  cy.setCookie('accessToken', 'test-access-token');
});

// Команда для очистки токенов
Cypress.Commands.add('clearAuthTokens', () => {
  cy.window().then((window) => {
    window.localStorage.removeItem('refreshToken');
  });
  cy.clearCookie('accessToken');
});

// Команда для перехвата всех API запросов
Cypress.Commands.add('interceptApi', () => {
  // Перехват запроса ингредиентов
  cy.intercept('GET', '**/api/ingredients', {
    fixture: 'ingredients.json'
  }).as('getIngredients');

  // Перехват запроса получения пользователя
  cy.intercept('GET', '**/api/auth/user', {
    fixture: 'user.json'
  }).as('getUser');

  // Перехват создания заказа
  cy.intercept('POST', '**/api/orders', {
    fixture: 'order.json'
  }).as('createOrder');
});

export {};
