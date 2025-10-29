/// <reference types="cypress" />

import { SELECTORS, INGREDIENTS } from '../support/selectors';

describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.interceptApi();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должно открыть модальное окно при клике на ингредиент', () => {
    // Кликаем на ингредиент
    cy.openIngredientModal(INGREDIENTS.BUN);

    // Проверяем что модальное окно открылось
    cy.modalShouldBeVisible();

    // Сохраняем alias для модального окна
    cy.get(SELECTORS.MODAL).as('modal');

    // Проверяем заголовок модального окна
    cy.get('@modal')
      .should('contain', 'Детали ингредиента');
  });

  it('должно отображать корректные данные ингредиента в модальном окне', () => {
    // Кликаем на конкретный ингредиент
    cy.openIngredientModal(INGREDIENTS.MAIN);

    // Сохраняем aliases
    cy.get(SELECTORS.MODAL).as('modal');
    cy.get(SELECTORS.INGREDIENT_DETAILS).as('details');

    // Проверяем что модальное окно содержит правильное название
    cy.get('@modal')
      .should('contain', INGREDIENTS.MAIN);

    // Проверяем отображение пищевой ценности
    cy.get('@details').within(() => {
      cy.contains('Калории').parent().should('contain', '4242');
      cy.contains('Белки').parent().should('contain', '420');
      cy.contains('Жиры').parent().should('contain', '142');
      cy.contains('Углеводы').parent().should('contain', '242');
    });
  });

  it('должно закрыть модальное окно при клике на крестик', () => {
    // Открываем модальное окно
    cy.openIngredientModal(INGREDIENTS.BUN);

    // Проверяем что модальное окно видимо
    cy.modalShouldBeVisible();

    // Закрываем через кастомную команду
    cy.closeModalByButton();

    // Проверяем что модальное окно закрылось
    cy.modalShouldNotExist();
  });

  it('должно закрыть модальное окно при клике на оверлей', () => {
    // Открываем модальное окно
    cy.openIngredientModal(INGREDIENTS.SAUCE);

    // Проверяем что модальное окно видимо
    cy.modalShouldBeVisible();

    // Закрываем через кастомную команду
    cy.closeModalByOverlay();

    // Проверяем что модальное окно закрылось
    cy.modalShouldNotExist();
  });

  it('должно закрыть модальное окно при нажатии Escape', () => {
    // Открываем модальное окно
    cy.openIngredientModal(INGREDIENTS.BUN);

    // Проверяем что модальное окно видимо
    cy.modalShouldBeVisible();

    // Нажимаем Escape
    cy.get('body').type('{esc}');

    // Проверяем что модальное окно закрылось
    cy.modalShouldNotExist();
  });

  it('должно открывать разные модальные окна для разных ингредиентов', () => {
    // Открываем модальное окно для первого ингредиента
    cy.openIngredientModal(INGREDIENTS.BUN);

    // Сохраняем alias для модального окна
    cy.get(SELECTORS.MODAL).as('modal');

    cy.get('@modal')
      .should('contain', INGREDIENTS.BUN);

    // Закрываем модальное окно
    cy.closeModalByButton();

    // Открываем модальное окно для другого ингредиента
    cy.openIngredientModal(INGREDIENTS.SAUCE_TRADITIONAL);

    cy.get(SELECTORS.MODAL).as('modal');

    cy.get('@modal')
      .should('contain', INGREDIENTS.SAUCE_TRADITIONAL)
      .should('not.contain', INGREDIENTS.BUN);
  });

  it('URL должен изменяться при открытии модального окна ингредиента', () => {
    // Кликаем на ингредиент
    cy.openIngredientModal(INGREDIENTS.BUN);

    // Проверяем что URL изменился
    cy.url().should('include', `/ingredients/${INGREDIENTS.BUN_ID}`);

    // Закрываем модальное окно
    cy.closeModalByButton();

    // Проверяем что URL вернулся на главную
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('должно открывать модальное окно при прямом переходе по URL', () => {
    // Переходим напрямую по URL ингредиента
    cy.visit(`/ingredients/${INGREDIENTS.BUN_ID}`);

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');

    // Проверяем что модальное окно открылось
    cy.modalShouldBeVisible();

    // Сохраняем alias
    cy.get(SELECTORS.MODAL).as('modal');

    // Проверяем содержимое
    cy.get('@modal')
      .should('contain', INGREDIENTS.BUN);
  });
});
