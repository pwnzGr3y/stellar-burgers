/// <reference types="cypress" />

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    // Перехватываем API запросы
    cy.interceptApi();

    // Переходим на главную страницу
    cy.visit('/');

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  it('должен добавить ингредиент из списка в конструктор при клике', () => {
    // Находим первую булку и кликаем на кнопку "Добавить"
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    // Проверяем, что булка добавилась в конструктор
    cy.get('[data-testid="burger-constructor"]')
      .should('contain', 'Краторная булка N-200i');

    // Находим биокотлету и добавляем в конструктор
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

    // Проверяем, что начинка добавилась
    cy.get('[data-testid="burger-constructor"]')
      .should('contain', 'Биокотлета из марсианской Магнолии');

    // Добавляем соус
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Соус Spicy-X')
      .parent()
      .find('button')
      .click();

    // Проверяем, что соус добавился
    cy.get('[data-testid="burger-constructor"]')
      .should('contain', 'Соус Spicy-X');
  });

  it('должен отображать счетчик добавленных ингредиентов', () => {
    // Добавляем ингредиент дважды
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Соус Spicy-X')
      .parent()
      .find('button')
      .click()
      .click();

    // Проверяем счетчик (должен быть 2)
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Соус Spicy-X')
      .parent()
      .find('[data-testid="ingredient-count"]')
      .should('contain', '2');
  });

  it('должен позволить удалить ингредиент из конструктора', () => {
    // Добавляем ингредиент
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

    // Проверяем что ингредиент добавлен
    cy.get('[data-testid="burger-constructor"]')
      .should('contain', 'Биокотлета из марсианской Магнолии');

    // Удаляем ингредиент
    cy.get('[data-testid="constructor-element__action"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .parent()
      .find('.constructor-element__action')
      .click();

    // Проверяем что ингредиент удален
    cy.get('[data-testid="burger-constructor"]')
      .should('not.contain', 'Биокотлета из марсианской Магнолии');
  });

  it('должен обновлять общую стоимость при добавлении ингредиентов', () => {
    // Добавляем булку (1255 * 2 = 2510)
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .click();

    // Проверяем начальную стоимость
    cy.get('[data-testid="total-price"]').should('contain', '2510');

    // Добавляем биокотлету (424)
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .click();

    // Проверяем обновленную стоимость (2510 + 424 = 2934)
    cy.get('[data-testid="total-price"]').should('contain', '2934');

    // Добавляем соус (90)
    cy.get('[data-testid="burger-ingredient"]')
      .contains('Соус Spicy-X')
      .parent()
      .find('button')
      .click();

    // Проверяем итоговую стоимость (2934 + 90 = 3024)
    cy.get('[data-testid="total-price"]').should('contain', '3024');
  });
});
