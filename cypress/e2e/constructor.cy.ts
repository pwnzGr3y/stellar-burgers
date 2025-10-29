/// <reference types="cypress" />

import { SELECTORS, INGREDIENTS, PRICES } from '../support/selectors';

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    // Перехватываем API запросы
    cy.interceptApi();

    // Переходим на главную страницу
    cy.visit('/');

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');

    // Создаем aliases для часто используемых элементов
    cy.get(SELECTORS.BURGER_CONSTRUCTOR).as('constructor');
    cy.get(SELECTORS.TOTAL_PRICE).as('totalPrice');
  });

  it('должен добавить ингредиент из списка в конструктор при клике', () => {
    // Добавляем булку
    cy.addIngredientToConstructor(INGREDIENTS.BUN);

    // Проверяем, что булка добавилась в конструктор
    cy.get('@constructor')
      .should('contain', INGREDIENTS.BUN);

    // Добавляем биокотлету
    cy.addIngredientToConstructor(INGREDIENTS.MAIN);

    // Проверяем, что начинка добавилась
    cy.get('@constructor')
      .should('contain', INGREDIENTS.MAIN);

    // Добавляем соус
    cy.addIngredientToConstructor(INGREDIENTS.SAUCE);

    // Проверяем, что соус добавился
    cy.get('@constructor')
      .should('contain', INGREDIENTS.SAUCE);
  });

  it('должен отображать счетчик добавленных ингредиентов', () => {
    // Добавляем ингредиент дважды
    cy.addIngredientToConstructor(INGREDIENTS.SAUCE);
    cy.addIngredientToConstructor(INGREDIENTS.SAUCE);

    // Проверяем счетчик (должен быть 2)
    cy.get(SELECTORS.BURGER_INGREDIENT)
      .contains(INGREDIENTS.SAUCE)
      .parent()
      .find(SELECTORS.INGREDIENT_COUNT)
      .should('contain', '2');
  });

  it('должен позволить удалить ингредиент из конструктора', () => {
    // Добавляем ингредиент
    cy.addIngredientToConstructor(INGREDIENTS.MAIN);

    // Проверяем что ингредиент добавлен
    cy.get('@constructor')
      .should('contain', INGREDIENTS.MAIN);

    // Удаляем ингредиент
    cy.get(SELECTORS.CONSTRUCTOR_ELEMENT_ACTION)
      .contains(INGREDIENTS.MAIN)
      .parent()
      .parent()
      .find('.constructor-element__action')
      .click();

    // Проверяем что ингредиент удален
    cy.get('@constructor')
      .should('not.contain', INGREDIENTS.MAIN);
  });

  it('должен обновлять общую стоимость при добавлении ингредиентов', () => {
    // Добавляем булку (1255 * 2 = 2510)
    cy.addIngredientToConstructor(INGREDIENTS.BUN);

    // Проверяем начальную стоимость
    cy.get('@totalPrice').should('contain', PRICES.BUN_TOTAL.toString());

    // Добавляем биокотлету (424)
    cy.addIngredientToConstructor(INGREDIENTS.MAIN);

    // Проверяем обновленную стоимость (2510 + 424 = 2934)
    const priceAfterMain = PRICES.BUN_TOTAL + PRICES.MAIN;
    cy.get('@totalPrice').should('contain', priceAfterMain.toString());

    // Добавляем соус (90)
    cy.addIngredientToConstructor(INGREDIENTS.SAUCE);

    // Проверяем итоговую стоимость (2934 + 90 = 3024)
    const finalPrice = priceAfterMain + PRICES.SAUCE;
    cy.get('@totalPrice').should('contain', finalPrice.toString());
  });
});
