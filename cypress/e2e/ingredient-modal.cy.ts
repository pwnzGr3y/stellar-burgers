/// <reference types="cypress" />

describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.interceptApi();
  });

  it('должно открыть модальное окно при клике на ингредиент', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    // Кликаем на ингредиент
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Краторная булка N-200i')
      .click();

    // Проверяем что модальное окно открылось
    cy.get('[data-testid="modal"]').should('be.visible');

    // Проверяем заголовок модального окна
    cy.get('[data-testid="modal"]')
      .should('contain', 'Детали ингредиента');
  });

  it('должно отображать корректные данные ингредиента в модальном окне', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    // Кликаем на конкретный ингредиент
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Биокотлета из марсианской Магнолии')
      .click();

    // Проверяем что модальное окно содержит правильное название
    cy.get('[data-testid="modal"]')
      .should('contain', 'Биокотлета из марсианской Магнолии');

    // Проверяем отображение пищевой ценности
    cy.get('[data-testid="ingredient-details"]').within(() => {
      cy.contains('Калории').parent().should('contain', '4242');
      cy.contains('Белки').parent().should('contain', '420');
      cy.contains('Жиры').parent().should('contain', '142');
      cy.contains('Углеводы').parent().should('contain', '242');
    });
  });

  it('должно закрыть модальное окно при клике на крестик', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    // Открываем модальное окно
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Краторная булка N-200i')
      .click();

    // Проверяем что модальное окно видимо
    cy.get('[data-testid="modal"]').should('be.visible');

    // Кликаем на крестик закрытия
    cy.get('[data-testid="modal-close"]').click();

    // Проверяем что модальное окно закрылось
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должно закрыть модальное окно при клике на оверлей', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    // Открываем модальное окно
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Соус Spicy-X')
      .click();

    // Проверяем что модальное окно видимо
    cy.get('[data-testid="modal"]').should('be.visible');

    // Кликаем на оверлей (фон вне модального окна)
    cy.get('[data-testid="modal-overlay"]').click({ force: true });

    // Проверяем что модальное окно закрылось
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должно закрыть модальное окно при нажатии Escape', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    // Открываем модальное окно
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Краторная булка N-200i')
      .click();

    // Проверяем что модальное окно видимо
    cy.get('[data-testid="modal"]').should('be.visible');

    // Нажимаем Escape
    cy.get('body').type('{esc}');

    // Проверяем что модальное окно закрылось
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должно открывать разные модальные окна для разных ингредиентов', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    // Открываем модальное окно для первого ингредиента
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Краторная булка N-200i')
      .click();

    cy.get('[data-testid="modal"]')
      .should('contain', 'Краторная булка N-200i');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close"]').click();

    // Открываем модальное окно для другого ингредиента
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Соус традиционный галактический')
      .click();

    cy.get('[data-testid="modal"]')
      .should('contain', 'Соус традиционный галактический')
      .should('not.contain', 'Краторная булка N-200i');
  });

  it('URL должен изменяться при открытии модального окна ингредиента', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    // Кликаем на ингредиент
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Краторная булка N-200i')
      .click();

    // Проверяем что URL изменился
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close"]').click();

    // Проверяем что URL вернулся на главную
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('должно открывать модальное окно при прямом переходе по URL', () => {
    // Переходим напрямую по URL ингредиента
    cy.visit('/ingredients/643d69a5c3f7b9001cfa093c');

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');

    // Проверяем что модальное окно открылось
    cy.get('[data-testid="modal"]').should('be.visible');

    // Проверяем содержимое
    cy.get('[data-testid="modal"]')
      .should('contain', 'Краторная булка N-200i');
  });
});
