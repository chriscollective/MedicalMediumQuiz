# 測試指南 - 從 0 開始建立測試

## 📊 什麼是測試覆蓋率？

### **簡單定義**

**測試覆蓋率 (Test Coverage) = 有多少百分比的程式碼被測試執行過**

---

### **視覺化解釋**

```typescript
// ❌ 沒有測試：0% 覆蓋率
function calculateGrade(score: number, total: number) {
  const percentage = (score / total) * 100;

  if (percentage >= 90) return "S";      // 沒測試
  if (percentage >= 85) return "A+";     // 沒測試
  if (percentage >= 80) return "A";      // 沒測試
  // ...
  return "F";                            // 沒測試
}

// ✅ 有測試：100% 覆蓋率
test("90% 以上應該回傳 S", () => {
  expect(calculateGrade(18, 20)).toBe("S");  // ✅ 測試了
});

test("85-89% 應該回傳 A+", () => {
  expect(calculateGrade(17, 20)).toBe("A+"); // ✅ 測試了
});
// ... 測試所有分支
```

---

## 🎯 Code Review 的建議

根據您的 **codeReview.md (第 888-972 行)**：

> **現狀**: 0 個測試檔案（完全沒有測試）
>
> **建議覆蓋率目標**:
> - 關鍵業務邏輯: 80%+
> - API 端點: 70%+
> - UI 組件: 60%+

---

## 💡 為什麼需要測試？

### **真實情境 1：防止破壞功能**

**沒有測試：**
```typescript
// 某天您修改了這個函數...
function calculateGrade(score: number, total: number): string {
  const percentage = (score / total) * 10;  // ❌ 忘記 * 100
  if (percentage >= 90) return "S";
  // ...
}

// 部署到正式環境 → 所有等級都錯了 → 使用者投訴 😱
```

**有測試：**
```typescript
// 修改後立即執行測試
npm test

// ❌ FAIL: 測試失敗！
// Expected: "S", Received: "F"

// ✅ 立刻發現問題，修正後重新測試
// ✅ PASS: 所有測試通過
```

---

### **真實情境 2：重構時保證功能正常**

```typescript
// 重構前：長長的 if-else
function calculateGrade(score: number, total: number): string {
  const percentage = (score / total) * 100;
  if (percentage >= 90) return "S";
  if (percentage >= 85) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 75) return "B+";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C+";
  return "F";
}

// 重構後：查表法（更簡潔）
function calculateGrade(score: number, total: number): string {
  const percentage = (score / total) * 100;
  const grades = [
    { min: 90, grade: "S" },
    { min: 85, grade: "A+" },
    // ...
  ];
  return grades.find(g => percentage >= g.min)?.grade || "F";
}

// ✅ 執行測試 → 全部通過 → 確認重構沒問題
```

---

## 🛠️ 測試類型

您的專案需要 3 種測試：

### **1. 單元測試 (Unit Tests)** ⭐⭐⭐

**測試：** 單一函數或組件

**例子：**
- `calculateGrade()` 函數
- `GradeBadge` 組件
- `getRandomQuote()` 函數

**工具：** Jest + React Testing Library

**覆蓋率目標：** 80%+

---

### **2. API 測試 (Integration Tests)** ⭐⭐

**測試：** 後端 API 端點

**例子：**
- `POST /api/admin/login`
- `GET /api/questions`
- `POST /api/quizzes`

**工具：** Jest + Supertest

**覆蓋率目標：** 70%+

---

### **3. E2E 測試 (End-to-End Tests)** ⭐

**測試：** 完整的使用者流程

**例子：**
- 使用者登入 → 選擇書籍 → 完成測驗 → 查看結果
- 管理員登入 → 新增題目 → 查看統計

**工具：** Playwright

**覆蓋率目標：** 關鍵流程 100%

---

## 📦 步驟 1：安裝測試工具

### **安裝套件**

```bash
npm install --save-dev @types/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom supertest @types/supertest ts-jest
```

**套件說明：**

| 套件 | 用途 |
|------|------|
| `jest` | 測試框架（核心） |
| `@testing-library/react` | React 組件測試 |
| `@testing-library/jest-dom` | DOM 測試工具 |
| `@testing-library/user-event` | 模擬使用者操作 |
| `supertest` | API 測試 |
| `ts-jest` | TypeScript 支援 |
| `jest-environment-jsdom` | 瀏覽器環境模擬 |

---

## ⚙️ 步驟 2：設定 Jest

### **創建 `jest.config.js`**

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/server/src'],

  // 測試檔案匹配規則
  testMatch: [
    '**/__tests__/**/*.ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)'
  ],

  // 模組路徑別名（對應 vite.config.ts）
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // 設定測試環境
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // 測試覆蓋率設定
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'server/src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],

  // 覆蓋率門檻（測試失敗條件）
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
};
```

---

### **創建 `jest.setup.js`**

```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock window.matchMedia（Radix UI 需要）
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

---

## 📝 步驟 3：寫第一個測試

### **範例 1：測試工具函數**

創建 `src/utils/__tests__/gradeCalculator.test.ts`：

```typescript
// src/utils/gradeCalculator.ts
export function calculateGrade(score: number, total: number): string {
  if (total === 0) return "F";

  const percentage = (score / total) * 100;

  if (percentage >= 90) return "S";
  if (percentage >= 85) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 75) return "B+";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C+";
  return "F";
}

// src/utils/__tests__/gradeCalculator.test.ts
import { calculateGrade } from '../gradeCalculator';

describe('calculateGrade', () => {
  test('總分為 0 時應該回傳 F', () => {
    expect(calculateGrade(10, 0)).toBe('F');
  });

  test('100% 應該回傳 S', () => {
    expect(calculateGrade(20, 20)).toBe('S');
  });

  test('90% 應該回傳 S', () => {
    expect(calculateGrade(18, 20)).toBe('S');
  });

  test('89% 應該回傳 A+', () => {
    expect(calculateGrade(17.8, 20)).toBe('A+');
  });

  test('85% 應該回傳 A+', () => {
    expect(calculateGrade(17, 20)).toBe('A+');
  });

  test('84% 應該回傳 A', () => {
    expect(calculateGrade(16.8, 20)).toBe('A');
  });

  test('0% 應該回傳 F', () => {
    expect(calculateGrade(0, 20)).toBe('F');
  });
});
```

**執行測試：**
```bash
npm test
```

**預期輸出：**
```
PASS  src/utils/__tests__/gradeCalculator.test.ts
  calculateGrade
    ✓ 總分為 0 時應該回傳 F (2 ms)
    ✓ 100% 應該回傳 S (1 ms)
    ✓ 90% 應該回傳 S
    ✓ 89% 應該回傳 A+
    ✓ 85% 應該回傳 A+
    ✓ 84% 應該回傳 A
    ✓ 0% 應該回傳 F

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Coverage:    100% (calculateGrade.ts)
```

---

### **範例 2：測試 React 組件**

創建 `src/components/__tests__/GradeBadge.test.tsx`：

```typescript
// src/components/__tests__/GradeBadge.test.tsx
import { render, screen } from '@testing-library/react';
import { GradeBadge } from '../GradeBadge';

describe('GradeBadge', () => {
  test('應該顯示 S 等級', () => {
    render(<GradeBadge grade="S" />);
    expect(screen.getByText('S')).toBeInTheDocument();
  });

  test('應該顯示 A+ 等級', () => {
    render(<GradeBadge grade="A+" />);
    expect(screen.getByText('A+')).toBeInTheDocument();
  });

  test('S 等級應該有金色樣式', () => {
    const { container } = render(<GradeBadge grade="S" />);
    const badge = container.firstChild;

    // 檢查是否有金色漸變
    expect(badge).toHaveStyle({
      backgroundImage: expect.stringContaining('#E5C17A'),
    });
  });
});
```

---

### **範例 3：測試 API 端點**

創建 `server/src/__tests__/auth.test.ts`：

```typescript
// server/src/__tests__/auth.test.ts
import request from 'supertest';
import express from 'express';
import { adminRouter } from '../routes/admin';

// 創建測試用的 Express app
const app = express();
app.use(express.json());
app.use('/api/admin', adminRouter);

describe('POST /api/admin/login', () => {
  test('正確的帳號密碼應該回傳 token', async () => {
    const response = await request(app)
      .post('/api/admin/login')
      .send({
        username: 'admin',
        password: 'correct_password'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
  });

  test('錯誤的密碼應該回傳 401', async () => {
    const response = await request(app)
      .post('/api/admin/login')
      .send({
        username: 'admin',
        password: 'wrong_password'
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('5 次失敗後應該鎖定帳號', async () => {
    // 連續 5 次錯誤
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/admin/login')
        .send({ username: 'admin', password: 'wrong' });
    }

    // 第 6 次（即使密碼正確也應該被鎖定）
    const response = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'correct_password' });

    expect(response.status).toBe(423);
    expect(response.body.message).toContain('鎖定');
  });
});
```

---

## 🚀 步驟 4：執行測試

### **添加 npm 腳本**

在 `package.json` 的 `scripts` 中添加：

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ui": "jest --coverage --coverageReporters=html"
  }
}
```

---

### **執行指令**

```bash
# 執行所有測試
npm test

# 監聽模式（自動重新測試）
npm run test:watch

# 生成覆蓋率報告
npm run test:coverage

# 生成 HTML 覆蓋率報告（可視化）
npm run test:ui
```

---

### **覆蓋率報告範例**

```bash
npm run test:coverage
```

**輸出：**
```
-----------------------|---------|----------|---------|---------|
File                   | % Stmts | % Branch | % Funcs | % Lines |
-----------------------|---------|----------|---------|---------|
All files              |   78.45 |    65.21 |   82.14 |   79.32 |
 src/utils             |   95.00 |    90.00 |  100.00 |   95.00 |
  gradeCalculator.ts   |  100.00 |   100.00 |  100.00 |  100.00 |
  helpers.ts           |   90.00 |    80.00 |  100.00 |   90.00 |
 src/components        |   65.00 |    50.00 |   70.00 |   66.00 |
  GradeBadge.tsx       |   80.00 |    75.00 |  100.00 |   80.00 |
  QuestionCard.tsx     |   50.00 |    25.00 |   40.00 |   52.00 |
-----------------------|---------|----------|---------|---------|
```

**說明：**
- **% Stmts**：陳述式覆蓋率
- **% Branch**：分支覆蓋率（if-else）
- **% Funcs**：函數覆蓋率
- **% Lines**：行數覆蓋率

---

## 📊 步驟 5：查看視覺化報告

執行後會生成 HTML 報告：

```bash
npm run test:ui
```

**報告位置：** `coverage/index.html`

**用瀏覽器打開：**
```bash
# Windows
start coverage/index.html

# 或手動打開
C:\Users\Chris\Desktop\MMquiz\coverage\index.html
```

**報告內容：**
- 📊 總覆蓋率圖表
- 📁 每個檔案的覆蓋率
- 🔍 點擊檔案可看到哪些行沒被測試（紅色標記）

---

## 🎯 實際操作建議

### **建議的測試優先順序**

根據 Code Review，您應該先測試：

#### **第 1 週：核心業務邏輯（80% 覆蓋率）**

```bash
# 優先測試這些檔案：
src/utils/gradeCalculator.ts       # 等級計算
src/data/mmContent.ts               # MM 內容管理
server/src/models/Admin.ts          # 管理員模型（登入鎖定）
server/src/controllers/authController.ts  # 認證邏輯
```

---

#### **第 2 週：API 端點（70% 覆蓋率）**

```bash
# 測試這些 API：
POST /api/admin/login              # 登入
GET  /api/questions                # 取得題目
POST /api/quizzes                  # 建立測驗
POST /api/quizzes/:id/submit       # 提交測驗
```

---

#### **第 3 週：UI 組件（60% 覆蓋率）**

```bash
# 測試這些組件：
src/components/GradeBadge.tsx      # 等級徽章
src/components/QuestionCard.tsx    # 題目卡片
src/pages/ResultPage.tsx           # 結果頁面
```

---

## 🆘 常見問題

### **Q1: 測試要寫多詳細？**

**A:**

**必測：**
- ✅ 所有 if-else 分支
- ✅ 邊界條件（0、最大值、null）
- ✅ 錯誤處理

**選測：**
- ⚠️ UI 樣式（較不重要）
- ⚠️ 簡單的 getter/setter

---

### **Q2: 如何提高覆蓋率？**

**A:** 執行覆蓋率報告，找到紅色區域：

```bash
npm run test:ui
# 打開 coverage/index.html
# 點擊紅色檔案
# 寫測試覆蓋紅色行
```

---

### **Q3: 測試執行很慢怎麼辦？**

**A:**

```bash
# 只測試修改的檔案
npm run test:watch

# 只執行特定測試
npm test -- gradeCalculator

# 平行執行
npm test -- --maxWorkers=4
```

---

### **Q4: 如何測試 MongoDB 操作？**

**A:** 使用 Mock 或測試資料庫：

```typescript
// 選項 1：Mock mongoose
jest.mock('mongoose');

// 選項 2：使用 MongoDB Memory Server
import { MongoMemoryServer } from 'mongodb-memory-server';
```

---

## 📚 學習資源

### **官方文檔：**
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)

### **推薦教學：**
- [Kent C. Dodds - Testing JavaScript](https://testingjavascript.com/)
- [Jest Crash Course (YouTube)](https://www.youtube.com/watch?v=7r4xVDI2vho)

---

## ✅ 檢查清單

完成測試設定後：

- [ ] 安裝測試套件
- [ ] 創建 `jest.config.js`
- [ ] 創建 `jest.setup.js`
- [ ] 寫第一個測試（gradeCalculator）
- [ ] 執行 `npm test` 確認通過
- [ ] 執行 `npm run test:coverage` 查看覆蓋率
- [ ] 設定 CI/CD（自動執行測試）

---

## 🎯 目標達成

根據 Code Review 的建議：

**當前狀態：** 0% 覆蓋率 ❌

**目標狀態：**
- ✅ 關鍵業務邏輯: 80%+
- ✅ API 端點: 70%+
- ✅ UI 組件: 60%+

**時程：**
- 第 1 週：核心邏輯測試
- 第 2 週：API 測試
- 第 3 週：UI 測試
- 第 4 週：達到目標覆蓋率

---

## 💡 下一步

**立即開始：**

1. 安裝測試套件
2. 複製 jest 配置
3. 寫第一個測試
4. 執行看看！

需要我幫您設定嗎？ 🚀
