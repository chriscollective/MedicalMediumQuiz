// 引入 jest-dom 提供額外的 matchers
require('@testing-library/jest-dom');

// 只在 jsdom 環境中設置瀏覽器相關的 mock
if (typeof window !== 'undefined') {
  // Mock window.matchMedia（Radix UI 和其他 UI 套件需要）
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return [];
    }
    unobserve() {}
  };

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  };
}

// 設定全域測試 timeout
jest.setTimeout(10000);
