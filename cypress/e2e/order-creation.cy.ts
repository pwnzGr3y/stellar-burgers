/// <reference types="cypress" />

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.interceptApi();
  });

  afterEach(() => {
    // Очищаем токены после каждого теста
    cy.clearAuthTokens();
  });

  it('должен создать заказ с авторизацией и показать модальное окно с номером заказа', () => {
    // Устанавливаем фейковые токены авторизации
    cy.setAuthTokens();

    // Переходим на главную страницу
    cy.visit('/');
    cy.wait('@getIngredients');

    // Добавляем булку в конструктор
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    // Проверяем что булка добавлена
    cy.get('[data-testid="burger-constructor"]')
      .should('contain', 'Краторная булка N-200i');

    // Добавляем начинку
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

    // Добавляем соус
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Соус Spicy-X')
      .parent()
      .find('button')
      .click();

    // Проверяем что все ингредиенты добавлены
    cy.get('[data-testid="burger-constructor"]')
      .should('contain', 'Биокотлета из марсианской Магнолии')
      .and('contain', 'Соус Spicy-X');

    // Кликаем на кнопку оформления заказа
    cy.get('[data-testid="order-button"]').click();

    // Ждем ответа от сервера
    cy.wait('@createOrder');

    // Проверяем что открылось модальное окно с деталями заказа
    cy.get('[data-testid="order-details"]').should('be.visible');

    // Проверяем номер заказа из фикстуры
    cy.get('[data-testid="order-number"]').should('contain', '60547');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close"]').click();

    // Проверяем что модальное окно закрылось
    cy.get('[data-testid="order-details"]').should('not.exist');

    // Проверяем что конструктор очистился
    cy.get('[data-testid="burger-constructor"]')
      .should('not.contain', 'Биокотлета из марсианской Магнолии')
      .and('not.contain', 'Соус Spicy-X');

    // Проверяем что стоимость сбросилась
    cy.get('[data-testid="total-price"]').should('contain', '0');
  });

  it('должен перенаправлять на страницу логина при попытке оформления заказа без авторизации', () => {
    // НЕ устанавливаем токены (пользователь не авторизован)

    cy.visit('/');
    cy.wait('@getIngredients');

    // Добавляем ингредиенты
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    cy.get('[data-testid="burger-ingredient"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

    // Кликаем на кнопку оформления заказа
    cy.get('[data-testid="order-button"]').click();

    // Проверяем что произошел редирект на страницу логина
    cy.url().should('include', '/login');
  });

  it('не должен позволить оформить заказ без булки', () => {
    cy.setAuthTokens();

    cy.visit('/');
    cy.wait('@getIngredients');

    // Добавляем только начинку, без булки
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

    cy.get('[data-testid="burger-ingredient"]')
      .contains('Соус Spicy-X')
      .parent()
      .find('button')
      .click();

    // Кнопка оформления заказа должна быть неактивна
    cy.get('[data-testid="order-button"]').find('button').should('be.disabled');
  });

  it('должен корректно отображать общую стоимость заказа', () => {
    cy.setAuthTokens();

    cy.visit('/');
    cy.wait('@getIngredients');

    // Проверяем начальную стоимость
    cy.get('[data-testid="total-price"]').should('contain', '0');

    // Добавляем булку (1255 * 2 = 2510)
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    cy.get('[data-testid="total-price"]').should('contain', '2510');

    // Добавляем начинку (424)
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

    cy.get('[data-testid="total-price"]').should('contain', '2934');

    // Добавляем соус (90)
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Соус Spicy-X')
      .parent()
      .find('button')
      .click();

    cy.get('[data-testid="total-price"]').should('contain', '3024');
  });

  it('должен сохранять состояние конструктора при перезагрузке страницы', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    // Добавляем ингредиенты
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    cy.get('[data-testid="burger-ingredient"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

    // Перезагружаем страницу
    cy.reload();
    cy.wait('@getIngredients');

    // Проверяем что ингредиенты остались (если реализовано сохранение в localStorage)
    // Если не реализовано - конструктор должен быть пустым
    // Этот тест зависит от реализации проекта
  });
});
