type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerConfig {
  failureThreshold: number; // Количество ошибок для открытия цепи
  timeout: number; // Время в мс, после которого цепь переходит в HALF_OPEN
  resetTimeout: number; // Время в мс для сброса счетчика ошибок
}

class CircuitBreaker {
  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      failureThreshold: config.failureThreshold || 3,
      timeout: config.timeout || 30000, // 30 секунд
      resetTimeout: config.resetTimeout || 60000 // 1 минута
    };
  }

  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private openedAt: number | null = null;
  private config: CircuitBreakerConfig;

  private canExecute(): boolean {
    const now = Date.now();

    // Если цепь закрыта - можно выполнять
    if (this.state === 'CLOSED') {
      return true;
    }

    // Если цепь открыта - проверяем, не пора ли перейти в HALF_OPEN
    if (this.state === 'OPEN' && this.openedAt) {
      if (now - this.openedAt >= this.config.timeout) {
        console.info('[Circuit Breaker] Переход в HALF_OPEN состояние');
        this.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }

    // В HALF_OPEN состоянии даем одну попытку
    return this.state === 'HALF_OPEN';
  }

  private onSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      console.info('[Circuit Breaker] API восстановлен. Переход в CLOSED');
      this.reset();
    }

    // Сброс счетчика при успешном запросе после длительного периода
    const now = Date.now();
    if (
      this.lastFailureTime &&
      now - this.lastFailureTime > this.config.resetTimeout
    ) {
      this.failureCount = 0;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN') {
      console.warn(
        '[Circuit Breaker] Запрос в HALF_OPEN провалился, возврат в OPEN'
      );
      this.open();
      return;
    }

    if (this.failureCount >= this.config.failureThreshold) {
      console.error(
        `[Circuit Breaker] Достигнут порог ошибок (${this.failureCount}). Открытие цепи на ${this.config.timeout / 1000} сек.`
      );
      this.open();
    }
  }

  private open(): void {
    this.state = 'OPEN';
    this.openedAt = Date.now();
  }

  private reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.openedAt = null;
    this.lastFailureTime = null;
  }

  private getTimeUntilHalfOpen(): number {
    if (this.state !== 'OPEN' || !this.openedAt) {
      return 0;
    }
    const elapsed = Date.now() - this.openedAt;
    return Math.max(0, this.config.timeout - elapsed);
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Проверяем, можно ли выполнить запрос
    if (!this.canExecute()) {
      const timeLeft = this.getTimeUntilHalfOpen();
      console.warn(
        `[Circuit Breaker] API недоступен. Следующая попытка через ${Math.ceil(timeLeft / 1000)} сек.`
      );
      throw new Error(
        `Circuit breaker is OPEN. API temporarily unavailable. Retry in ${Math.ceil(timeLeft / 1000)}s`
      );
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  getStats() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      timeUntilHalfOpen: this.getTimeUntilHalfOpen()
    };
  }
}

// Создаем единый экземпляр для всего API
export const apiCircuitBreaker = new CircuitBreaker({
  failureThreshold: 3, // После 3 ошибок подряд - блокируем
  timeout: 30000, // Блокировка на 30 секунд
  resetTimeout: 60000 // Сброс счетчика через 1 минуту успешной работы
});
