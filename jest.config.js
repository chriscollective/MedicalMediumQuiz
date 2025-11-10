/** @type {import('jest').Config} */
module.exports = {
  // 使用 ts-jest 處理 TypeScript
  preset: 'ts-jest',

  // 使用 jsdom 模擬瀏覽器環境
  testEnvironment: 'jsdom',

  // 測試檔案位置
  roots: ['<rootDir>/src', '<rootDir>/server/src'],

  // 測試檔案匹配規則
  testMatch: [
    '**/__tests__/**/*.ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)',
  ],

  // 模組路徑別名（對應 vite.config.ts）
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // 忽略 CSS 檔案
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // 忽略圖片
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // 測試環境設定
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // 測試覆蓋率設定
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'server/src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!server/src/server.ts',
    '!**/__tests__/**',
  ],

  // 覆蓋率門檻（先設定寬鬆，逐步提高）
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // 忽略的目錄
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],

  // 轉換設定
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
};
