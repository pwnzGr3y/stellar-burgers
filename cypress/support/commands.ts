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

      /**
       * Добавляет ингредиент в конструктор по имени
       * @param ingredientName - Название ингредиента
       * @example cy.addIngredientToConstructor('Краторная булка N-200i')
       */
      addIngredientToConstructor(ingredientName: string): Chainable<void>;

      /**
       * Открывает модальное окно ингредиента по имени
       * @param ingredientName - Название ингредиента
       * @example cy.openIngredientModal('Краторная булка N-200i')
       */
      openIngredientModal(ingredientName: string): Chainable<void>;

      /**
       * Проверяет, что модальное окно видимо
       * @example cy.modalShouldBeVisible()
       */
      modalShouldBeVisible(): Chainable<void>;

      /**
       * Проверяет, что модальное окно отсутствует
       * @example cy.modalShouldNotExist()
       */
      modalShouldNotExist(): Chainable<void>;

      /**
       * Закрывает модальное окно по клику на крестик
       * @example cy.closeModalByButton()
       */
      closeModalByButton(): Chainable<void>;

      /**
       * Закрывает модальное окно по клику на оверлей
       * @example cy.closeModalByOverlay()
       */
      closeModalByOverlay(): Chainable<void>;
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

// Команда для добавления ингредиента в конструктор
Cypress.Commands.add('addIngredientToConstructor', (ingredientName: string) => {
  cy.get('[data-testid="burger-ingredient"]')
    .contains(ingredientName)
    .parent()
    .find('button')
    .click();
});

// Команда для открытия модального окна ингредиента
Cypress.Commands.add('openIngredientModal', (ingredientName: string) => {
  cy.get('[data-testid="burger-ingredient"]')
    .contains(ingredientName)
    .click();
});

// Команда для проверки видимости модального окна
Cypress.Commands.add('modalShouldBeVisible', () => {
  cy.get('[data-testid="modal"]').should('be.visible');
});

// Команда для проверки отсутствия модального окна
Cypress.Commands.add('modalShouldNotExist', () => {
  cy.get('[data-testid="modal"]').should('not.exist');
});

// Команда для закрытия модального окна по кнопке
Cypress.Commands.add('closeModalByButton', () => {
  cy.get('[data-testid="modal-close"]').click();
});

// Команда для закрытия модального окна по оверлею
Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get('[data-testid="modal-overlay"]').click({ force: true });
});

export {};
