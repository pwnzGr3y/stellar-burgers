export const SELECTORS = {
  // Ингредиенты
  BURGER_INGREDIENT: '[data-testid="burger-ingredient"]',
  INGREDIENT_COUNT: '[data-testid="ingredient-count"]',

  // Конструктор бургера
  BURGER_CONSTRUCTOR: '[data-testid="burger-constructor"]',
  CONSTRUCTOR_ELEMENT_ACTION: '[data-testid="constructor-element__action"]',

  // Модальные окна
  MODAL: '[data-testid="modal"]',
  MODAL_CLOSE: '[data-testid="modal-close"]',
  MODAL_OVERLAY: '[data-testid="modal-overlay"]',

  // Детали ингредиента
  INGREDIENT_DETAILS: '[data-testid="ingredient-details"]',

  // Заказ
  ORDER_BUTTON: '[data-testid="order-button"]',
  ORDER_DETAILS: '[data-testid="order-details"]',
  ORDER_NUMBER: '[data-testid="order-number"]',
  TOTAL_PRICE: '[data-testid="total-price"]'
} as const;

// Названия ингредиентов для тестов
export const INGREDIENTS = {
  BUN: 'Краторная булка N-200i',
  BUN_ID: '643d69a5c3f7b9001cfa093c',
  MAIN: 'Биокотлета из марсианской Магнолии',
  SAUCE: 'Соус Spicy-X',
  SAUCE_TRADITIONAL: 'Соус традиционный галактический'
} as const;

// Ожидаемые цены для тестов
export const PRICES = {
  BUN: 1255,
  BUN_TOTAL: 2510, // Булка считается дважды (верх и низ)
  MAIN: 424,
  SAUCE: 90,
  EMPTY: 0
} as const;
