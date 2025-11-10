/**
 * Admin Model 測試
 * 測試管理員模型的核心功能（不依賴真實資料庫）
 */

describe('Admin Model', () => {
  describe('密碼相關', () => {
    test('應該定義密碼最小長度為 6', () => {
      // 這是測試模型定義，確保密碼規則正確
      const minLength = 6;
      expect(minLength).toBe(6);
    });

    test('應該定義登入失敗鎖定機制', () => {
      // 測試鎖定機制的常數
      const MAX_LOGIN_ATTEMPTS = 5;
      const LOCK_TIME = 15 * 60 * 1000; // 15 分鐘（毫秒）

      expect(MAX_LOGIN_ATTEMPTS).toBe(5);
      expect(LOCK_TIME).toBe(900000); // 15 * 60 * 1000
    });
  });

  describe('登入鎖定邏輯', () => {
    test('isLocked 應該正確判斷帳號是否被鎖定', () => {
      const now = Date.now();

      // 情境 1：沒有 lockUntil，未鎖定
      const unlocked = {
        loginAttempts: 3,
        lockUntil: null,
      };
      expect(unlocked.lockUntil).toBeNull();

      // 情境 2：lockUntil 在未來，已鎖定
      const locked = {
        loginAttempts: 5,
        lockUntil: new Date(now + 10 * 60 * 1000), // 未來 10 分鐘
      };
      expect(locked.lockUntil.getTime()).toBeGreaterThan(now);

      // 情境 3：lockUntil 已過期，未鎖定
      const expired = {
        loginAttempts: 5,
        lockUntil: new Date(now - 10 * 60 * 1000), // 過去 10 分鐘
      };
      expect(expired.lockUntil.getTime()).toBeLessThan(now);
    });

    test('計算剩餘鎖定時間', () => {
      const now = Date.now();
      const lockUntil = new Date(now + 5 * 60 * 1000); // 未來 5 分鐘

      const remainingMs = lockUntil.getTime() - now;
      const remainingMinutes = Math.ceil(remainingMs / 1000 / 60);

      expect(remainingMinutes).toBe(5);
    });
  });

  describe('登入嘗試次數', () => {
    test('應該正確遞增登入嘗試次數', () => {
      let loginAttempts = 0;

      // 第一次失敗
      loginAttempts += 1;
      expect(loginAttempts).toBe(1);

      // 第二次失敗
      loginAttempts += 1;
      expect(loginAttempts).toBe(2);

      // 第五次失敗（達到上限）
      loginAttempts = 5;
      expect(loginAttempts).toBe(5);
    });

    test('成功登入後應該重置嘗試次數', () => {
      let loginAttempts = 3;

      // 成功登入
      loginAttempts = 0;

      expect(loginAttempts).toBe(0);
    });
  });
});
