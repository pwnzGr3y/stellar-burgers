import { getCookie, setCookie, deleteCookie } from './cookie';

describe('cookie utils', () => {
  beforeEach(() => {
    // Очистка cookies перед каждым тестом
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
  });

  describe('setCookie', () => {
    it('должен установить cookie с именем и значением', () => {
      setCookie('testCookie', 'testValue');
      expect(document.cookie).toContain('testCookie=testValue');
    });

    it('должен установить cookie с path по умолчанию', () => {
      setCookie('testCookie', 'testValue');
      const cookie = getCookie('testCookie');
      expect(cookie).toBe('testValue');
    });

    it('должен установить cookie с числовым expires', () => {
      setCookie('testCookie', 'testValue', { expires: 3600 });
      expect(getCookie('testCookie')).toBe('testValue');
    });

    it('должен установить cookie с Date expires', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setCookie('testCookie', 'testValue', { expires: tomorrow });
      expect(getCookie('testCookie')).toBe('testValue');
    });

    it('должен кодировать значение cookie', () => {
      setCookie('testCookie', 'value with spaces');
      expect(getCookie('testCookie')).toBe('value with spaces');
    });

    it('должен установить cookie с дополнительными свойствами', () => {
      setCookie('testCookie', 'testValue', { path: '/' });
      expect(getCookie('testCookie')).toBe('testValue');
    });
  });

  describe('getCookie', () => {
    it('должен получить значение существующей cookie', () => {
      document.cookie = 'testCookie=testValue; path=/';
      expect(getCookie('testCookie')).toBe('testValue');
    });

    it('должен вернуть undefined для несуществующей cookie', () => {
      expect(getCookie('nonExistent')).toBeUndefined();
    });

    it('должен декодировать значение cookie', () => {
      document.cookie = 'testCookie=value%20with%20spaces; path=/';
      expect(getCookie('testCookie')).toBe('value with spaces');
    });

    it('должен обрабатывать специальные символы в имени cookie', () => {
      setCookie('test.cookie', 'value');
      expect(getCookie('test.cookie')).toBe('value');
    });
  });

  describe('deleteCookie', () => {
    it('должен удалить существующую cookie', () => {
      setCookie('testCookie', 'testValue');
      expect(getCookie('testCookie')).toBe('testValue');

      deleteCookie('testCookie');
      expect(getCookie('testCookie')).toBeUndefined();
    });

    it('не должен выбросить ошибку при удалении несуществующей cookie', () => {
      expect(() => deleteCookie('nonExistent')).not.toThrow();
    });
  });
});
