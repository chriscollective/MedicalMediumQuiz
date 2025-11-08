# 專案啟動 SOP：避免 Tailwind 災難 🚨

> 新專案開始前的檢查清單，避免重蹈覆轍

---

## 📋 階段 1：專案初始化檢查（5分鐘）

### 1.1 檢查 Tailwind 版本和配置

```bash
# 檢查已安裝的 Tailwind 版本
npm list tailwindcss

# 確認版本一致性
# - v3.x.x → 需要 tailwind.config.js + postcss.config.js
# - v4.x.x → 新的配置方式，確認官方文檔
```

**✅ 通過條件：**
- [ ] 能正確顯示 Tailwind 版本
- [ ] 版本與專案需求一致

### 1.2 必要配置檔案檢查

```bash
# 必須存在的檔案
ls -la | grep -E "tailwind\.config|postcss\.config"
```

**✅ Tailwind v3 必須有：**
- [ ] `tailwind.config.js` 或 `tailwind.config.ts`
- [ ] `postcss.config.js` 或 `postcss.config.cjs`
- [ ] `package.json` 中有 `tailwindcss` 和 `postcss`

**✅ Tailwind v4 必須確認：**
- [ ] 查閱官方遷移指南
- [ ] 確認新的配置方式

### 1.3 PostCSS 配置檢查

**檢查 `postcss.config.js` 內容：**

```javascript
// ✅ 正確的配置
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**❌ 常見錯誤：**
- 缺少 `postcss.config.js` 文件
- 缺少 `tailwindcss` 插件
- 語法錯誤（CommonJS vs ESM）

---

## 🧪 階段 2：功能驗證測試（10分鐘）

### 2.1 建立測試組件

在 `src/TestTailwind.tsx` 建立測試文件：

```tsx
export function TestTailwind() {
  return (
    <div className="p-8 space-y-4">
      {/* 測試 1: 基本類別 */}
      <div className="bg-red-500 text-white p-4">
        ✅ 基本顏色 (bg-red-500)
      </div>

      {/* 測試 2: 任意值 */}
      <div className="bg-[#A8CBB7] p-4">
        ⚠️ 任意值 (bg-[#A8CBB7])
      </div>

      {/* 測試 3: Hover 效果 */}
      <button className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white">
        🔄 Hover 測試
      </button>

      {/* 測試 4: 動態尺寸 */}
      <div className="w-6 h-6 bg-green-500">
        📏 w-6 h-6
      </div>

      {/* 測試 5: 漸變 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
        🌈 漸變測試
      </div>

      {/* 測試 6: 任意值漸變 */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] p-4">
        🎨 任意值漸變
      </div>
    </div>
  );
}
```

### 2.2 執行測試

```bash
# 1. 將測試組件加入 App.tsx
# 2. 啟動開發伺服器
npm run dev

# 3. 打開瀏覽器檢查
```

**✅ 通過條件：**
- [ ] 測試 1: 紅色背景顯示正確
- [ ] 測試 2: 自定義顏色顯示正確
- [ ] 測試 3: Hover 時顏色改變
- [ ] 測試 4: 方塊是 24px × 24px
- [ ] 測試 5: 標準漸變正常
- [ ] 測試 6: 任意值漸變正常

**❌ 如果任何一項失敗：**
→ **立即停止開發，修復 Tailwind 設定！**

### 2.3 檢查編譯流程

```bash
# 開啟開發者工具，檢查 Network
# 找到 CSS 文件，確認：
```

**✅ 正確的狀況：**
- CSS 文件會**動態更新**（新增類別後會重新編譯）
- 檔案大小隨使用的類別增長
- 熱更新正常運作

**❌ 錯誤的狀況（本專案的問題）：**
- CSS 文件是靜態的、永不改變
- 新增類別不會觸發重新編譯
- 需要手動重啟才能看到變化

---

## 🔍 階段 3：深度檢查（5分鐘）

### 3.1 檢查 CSS Import 路徑

**查看 `main.tsx` 或 `App.tsx`：**

```tsx
// ✅ 正確：Import 源文件
import './app.css'
import './index.css'  // 內含 @tailwind 指令

// ❌ 錯誤：Import 編譯結果
import './dist/output.css'  // 這是編譯後的靜態文件
```

### 3.2 檢查 CSS 源文件內容

**`src/index.css` 或 `src/app.css` 必須包含：**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**❌ 如果看到的是這樣：**
```css
/*! tailwindcss v4.1.3 | MIT License | ... */
@layer properties {
  /* 4000+ 行的編譯結果 */
}
```
→ **這是編譯後的文件，不是源文件！**

### 3.3 Vite 配置檢查

**檢查 `vite.config.ts`：**

```typescript
// 不需要特別的 Tailwind 配置
// Vite 會自動處理 PostCSS

export default defineConfig({
  plugins: [react()],
  // ... 其他配置
});
```

**✅ 通過條件：**
- [ ] 沒有手動處理 CSS 編譯
- [ ] 沒有自定義 CSS 處理流程
- [ ] PostCSS 由 Vite 自動處理

---

## ⚠️ 階段 4：常見陷阱檢測

### 陷阱 1: 使用預編譯的 Tailwind CDN

```html
<!-- ❌ 絕對不要用 CDN -->
<script src="https://cdn.tailwindcss.com"></script>
```

**為什麼不行：**
- 無法自定義配置
- 無法使用任意值
- 體積巨大（包含所有類別）
- 生產環境性能差

### 陷阱 2: 混用多個 CSS 框架

```json
// ❌ 危險組合
{
  "dependencies": {
    "tailwindcss": "^3.0.0",
    "bootstrap": "^5.0.0",  // 衝突！
    "bulma": "^0.9.0"       // 衝突！
  }
}
```

### 陷阱 3: Tailwind 配置錯誤的 content 路徑

```javascript
// ❌ 錯誤：遺漏檔案
module.exports = {
  content: ["./src/**/*.tsx"],  // 只掃描 tsx，漏掉 jsx/ts/js
}

// ✅ 正確：包含所有可能的檔案
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
}
```

---

## 📝 階段 5：建立專案文檔

### 5.1 在專案根目錄建立 `STYLING.md`

```markdown
# 樣式指南

## 使用的 CSS 框架
- Tailwind CSS v3.x.x
- PostCSS + Autoprefixer

## 注意事項
- ✅ 動態編譯已正確設置
- ✅ 所有 Tailwind 類別都能正常使用
- ✅ 支援任意值和自定義顏色

## 快速測試
運行測試組件確認 Tailwind 正常：
\`\`\`bash
# 開啟 /test-tailwind 路由查看
\`\`\`

## 故障排除
如果 Tailwind 類別不生效：
1. 檢查 PostCSS 配置
2. 重啟開發伺服器
3. 清除 node_modules 重新安裝
```

### 5.2 提交驗證檢查點

```bash
# 在 package.json 加入驗證腳本
{
  "scripts": {
    "validate:tailwind": "node scripts/validate-tailwind.js"
  }
}
```

**`scripts/validate-tailwind.js` 內容：**

```javascript
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const checks = [
  {
    name: 'PostCSS 配置存在',
    file: 'postcss.config.js',
    required: true
  },
  {
    name: 'Tailwind 配置存在',
    file: 'tailwind.config.js',
    required: true
  },
  {
    name: 'CSS 源文件包含 @tailwind',
    file: 'src/index.css',
    contains: '@tailwind'
  }
];

console.log('🔍 驗證 Tailwind 設定...\n');

let allPassed = true;

checks.forEach(check => {
  const filePath = path.join(__dirname, '..', check.file);
  const exists = fs.existsSync(filePath);

  if (!exists && check.required) {
    console.log(`❌ ${check.name}: 文件不存在 (${check.file})`);
    allPassed = false;
  } else if (exists && check.contains) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.includes(check.contains)) {
      console.log(`❌ ${check.name}: 未找到 "${check.contains}"`);
      allPassed = false;
    } else {
      console.log(`✅ ${check.name}`);
    }
  } else if (exists) {
    console.log(`✅ ${check.name}`);
  } else {
    console.log(`⚠️  ${check.name}: 文件不存在（非必需）`);
  }
});

if (allPassed) {
  console.log('\n✅ 所有檢查通過！Tailwind 設定正確。');
  process.exit(0);
} else {
  console.log('\n❌ 部分檢查失敗！請修復 Tailwind 設定。');
  process.exit(1);
}
```

---

## 🎯 完整 SOP 檢查清單

### 專案啟動當天

- [ ] 執行 `npm list tailwindcss` 確認版本
- [ ] 確認 `postcss.config.js` 存在且正確
- [ ] 確認 `tailwind.config.js` 的 content 路徑完整
- [ ] 檢查 CSS 源文件包含 `@tailwind` 指令
- [ ] 建立 `TestTailwind.tsx` 測試組件
- [ ] 執行所有 6 項測試並確認通過
- [ ] 檢查瀏覽器中 CSS 是否動態更新
- [ ] 建立 `STYLING.md` 文檔
- [ ] 加入 `validate:tailwind` 腳本
- [ ] **通過所有檢查後才開始開發**

### 每次 git clone 新專案

- [ ] `npm install` 後立即執行 `npm run validate:tailwind`
- [ ] 運行測試組件確認 Tailwind 正常
- [ ] 查看 `STYLING.md` 了解專案樣式規範

### 加入新開發者時

- [ ] 要求閱讀 `PROJECT_SETUP_SOP.md`
- [ ] 要求執行 `npm run validate:tailwind`
- [ ] 要求測試 `TestTailwind` 組件
- [ ] 確認理解何時用 Tailwind / 何時用 inline style

---

## 🚨 緊急修復流程

### 如果發現 Tailwind 類別不生效

**立即執行：**

```bash
# 1. 停止開發
Ctrl+C

# 2. 檢查配置
npm run validate:tailwind

# 3. 如果驗證失敗，修復配置後：
rm -rf node_modules package-lock.json
npm install

# 4. 重新測試
npm run dev
# 訪問測試組件
```

**如果還是失敗：**

1. 建立新的最小可復現案例
2. 對比官方 Tailwind 文檔
3. 考慮使用 inline style 作為臨時方案
4. **記錄到 `remind.md`**

---

## 📚 參考資源

- [Tailwind CSS 官方文檔](https://tailwindcss.com/docs/installation)
- [PostCSS 配置指南](https://postcss.org/)
- [Vite + Tailwind 官方指南](https://tailwindcss.com/docs/guides/vite)
- 本專案的慘痛教訓：`remind.md`

---

**記住：花 20 分鐘正確設定，省下 20 小時除錯時間！** ⏰
