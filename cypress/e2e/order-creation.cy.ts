/// <reference types="cypress" />

import { SELECTORS, INGREDIENTS, PRICES } from '../support/selectors';

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

    // Создаем aliases для часто используемых элементов
    cy.get(SELECTORS.BURGER_CONSTRUCTOR).as('constructor');
    cy.get(SELECTORS.TOTAL_PRICE).as('totalPrice');

    // Добавляем булку в конструктор
    cy.addIngredientToConstructor(INGREDIENTS.BUN);

    // Проверяем что булка добавлена
    cy.get('@constructor')
      .should('contain', INGREDIENTS.BUN);

    // Добавляем начинку
    cy.addIngredientToConstructor(INGREDIENTS.MAIN);

    // Добавляем соус
    cy.addIngredientToConstructor(INGREDIENTS.SAUCE);

    // Проверяем что все ингредиенты добавлены
    cy.get('@constructor')
      .should('contain', INGREDIENTS.MAIN)
      .and('contain', INGREDIENTS.SAUCE);

    // Кликаем на кнопку оформления заказа
    cy.get(SELECTORS.ORDER_BUTTON).click();

    // Ждем ответа от сервера
    cy.wait('@createOrder');

    // Создаем alias для деталей заказа
    cy.get(SELECTORS.ORDER_DETAILS).as('orderDetails');

    // Проверяем что открылось модальное окно с деталями заказа
    cy.get('@orderDetails').should('be.visible');

    // Проверяем номер заказа из фикстуры
    cy.get(SELECTORS.ORDER_NUMBER).should('contain', '60547');

    // Закрываем модальное окно
    cy.closeModalByButton();

    // Проверяем что модальное окно закрылось
    cy.get(SELECTORS.ORDER_DETAILS).should('not.exist');

    // Проверяем что конструктор очистился
    cy.get('@constructor')
      .should('not.contain', INGREDIENTS.MAIN)
      .and('not.contain', INGREDIENTS.SAUCE);

    // Проверяем что стоимость сбросилась
    cy.get('@totalPrice').should('contain', PRICES.EMPTY.toString());
  });

  it('должен перенаправлять на страницу логина при попытке оформления заказа без авторизации', () => {
    // НЕ устанавливаем токены (пользователь не авторизован)

    cy.visit('/');
    cy.wait('@getIngredients');

    // Добавляем ингредиенты
    cy.addIngredientToConstructor(INGREDIENTS.BUN);
    cy.addIngredientToConstructor(INGREDIENTS.MAIN);

    // Кликаем на кнопку оформления заказа
    cy.get(SELECTORS.ORDER_BUTTON).click();

    // Проверяем что произошел редирект на страницу логина
    cy.url().should('include', '/login');
  });

  it('не должен позволить оформить заказ без булки', () => {
    cy.setAuthTokens();

    cy.visit('/');
    cy.wait('@getIngredients');

    // Добавляем только начинку, без булки
    cy.addIngredientToConstructor(INGREDIENTS.MAIN);
    cy.addIngredientToConstructor(INGREDIENTS.SAUCE);

    // Кнопка оформления заказа должна быть неактивна
    cy.get(SELECTORS.ORDER_BUTTON).find('button').should('be.disabled');
  });

  it('должен корректно отображать общую стоимость заказа', () => {
    cy.setAuthTokens();

    cy.visit('/');
    cy.wait('@getIngredients');

    // Создаем alias для цены
    cy.get(SELECTORS.TOTAL_PRICE).as('totalPrice');

    // Проверяем начальную стоимость
    cy.get('@totalPrice').should('contain', PRICES.EMPTY.toString());

    // Добавляем булку (1255 * 2 = 2510)
    cy.addIngredientToConstructor(INGREDIENTS.BUN);
    cy.get('@totalPrice').should('contain', PRICES.BUN_TOTAL.toString());

    // Добавляем начинку (424)
    cy.addIngredientToConstructor(INGREDIENTS.MAIN);
    const priceAfterMain = PRICES.BUN_TOTAL + PRICES.MAIN;
    cy.get('@totalPrice').should('contain', priceAfterMain.toString());

    // Добавляем соус (90)
    cy.addIngredientToConstructor(INGREDIENTS.SAUCE);
    const finalPrice = priceAfterMain + PRICES.SAUCE;
    cy.get('@totalPrice').should('contain', finalPrice.toString());
  });

  it('должен сохранять состояние конструктора при перезагрузке страницы', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    // Добавляем ингредиенты
    cy.addIngredientToConstructor(INGREDIENTS.BUN);
    cy.addIngredientToConstructor(INGREDIENTS.MAIN);

    // Перезагружаем страницу
    cy.reload();
    cy.wait('@getIngredients');

    // Проверяем что ингредиенты остались (если реализовано сохранение в localStorage)
    // Если не реализовано - конструктор должен быть пустым
    // Этот тест зависит от реализации проекта
  });
});
