# 雙語切換功能開發待辦清單

## 📋 專案目標
為 MMquiz 測驗應用程式加入繁體中文（zh-TW）與英文（en）雙語切換功能

---

## 第一階段：前端多語系架構（MVP）

### ✅ 環境設置
- [ ] 安裝 `react-i18next` 和 `i18next`
- [ ] 安裝 `i18next-browser-languagedetector`（自動偵測瀏覽器語言）
- [ ] 安裝 `i18next-http-backend`（動態載入語言檔）

### ✅ 語言檔案結構建立
- [ ] 建立 `src/locales/` 目錄結構
  ```
  src/locales/
  ├── zh-TW/
  │   ├── common.json       # 共用詞彙（按鈕、標題、導航）
  │   ├── landing.json      # 首頁文案
  │   ├── quiz.json         # 測驗頁面文案
  │   ├── result.json       # 結果頁面文案
  │   ├── admin.json        # 管理後台文案
  │   ├── analytics.json    # 統計分析頁面
  │   ├── leaderboard.json  # 排行榜頁面
  │   └── errors.json       # 錯誤訊息
  └── en/
      ├── common.json
      ├── landing.json
      ├── quiz.json
      ├── result.json
      ├── admin.json
      ├── analytics.json
      ├── leaderboard.json
      └── errors.json
  ```

### ✅ i18n 初始化設定
- [ ] 建立 `src/i18n/config.ts` 設定檔
  - [ ] 設定支援語言：zh-TW（預設）、en
  - [ ] 設定語言偵測順序：localStorage → browser → fallback
  - [ ] 設定命名空間（namespaces）
  - [ ] 設定載入策略（懶加載 vs 全部載入）
- [ ] 在 `main.tsx` 中初始化 i18next

### ✅ 語言切換 UI 組件
- [ ] 建立 `src/components/LanguageSwitcher.tsx`
  - [ ] 設計樣式（🌐 中文 / EN 切換按鈕）
  - [ ] 整合到主導航列（右上角）
  - [ ] 實作語言切換邏輯
  - [ ] 儲存語言偏好到 localStorage
- [ ] 建立語言切換 Context（可選，如果需要全域狀態管理）

### ✅ 頁面文案替換
- [ ] **LandingPage** - 首頁
  - [ ] 標題「醫療靈媒隨堂測驗」
  - [ ] 書籍選擇標題
  - [ ] 難度選擇標題（初階/進階）
  - [ ] 開始測驗按鈕
  - [ ] 說明文字
- [ ] **QuizPage** - 測驗頁面
  - [ ] 「第 X 頁，共 Y 頁」
  - [ ] 「上一頁」/「下一頁」按鈕
  - [ ] 「提交測驗」按鈕
  - [ ] 題型標籤（單選/多選/填空）
  - [ ] Loading 狀態文字
- [ ] **ResultPage** - 結果頁面
  - [ ] 「測驗完成」標題
  - [ ] 成績顯示文字
  - [ ] 等級說明（S/A+/A/B+/B/C+/F）
  - [ ] 「錯題回顧」區塊
  - [ ] 「重新測驗」/「返回首頁」按鈕
  - [ ] 排行榜提交表單
- [ ] **AdminLogin** - 管理員登入
  - [ ] 表單欄位標籤（使用者名稱、密碼）
  - [ ] 登入按鈕
  - [ ] 錯誤訊息
- [ ] **AdminDashboard** - 管理員儀表板
  - [ ] 導航選單
  - [ ] 功能卡片標題
- [ ] **QuestionBank** - 題目管理
  - [ ] 表格欄位標題
  - [ ] 新增/編輯/刪除按鈕
  - [ ] 表單欄位標籤
- [ ] **Analytics** - 統計分析
  - [ ] 統計指標標題
  - [ ] 圖表標籤
  - [ ] 錯題排行榜標題
- [ ] **Leaderboard** - 排行榜
  - [ ] 表格欄位標題
  - [ ] 書籍篩選下拉選單

### ✅ 共用組件多語系
- [ ] **NatureDecoration** - 保持裝飾性無需翻譯
- [ ] **Button** - 無內建文字，僅樣式
- [ ] **Dialog** - 替換彈窗標題/按鈕文字
- [ ] **Toast/Sonner** - 替換通知訊息

### ✅ 測試與驗證
- [ ] 手動測試所有頁面切換語言
- [ ] 確認無遺漏的硬編碼中文字串
- [ ] 測試語言偏好持久化（重新載入後保持）
- [ ] 測試瀏覽器語言自動偵測

---

## 第二階段：後端 API 多語系

### ✅ 後端語言偵測中間件
- [ ] 建立 `server/src/middleware/languageDetector.ts`
  - [ ] 讀取 `Accept-Language` header
  - [ ] 支援 query parameter `?lang=en`
  - [ ] 將語言資訊附加到 `req.language`
  - [ ] 預設回退到 zh-TW

### ✅ 後端語言檔案
- [ ] 建立 `server/src/locales/` 目錄
  ```
  server/locales/
  ├── zh-TW.json
  └── en.json
  ```
- [ ] 建立語言載入工具函數 `server/src/utils/i18n.ts`

### ✅ API 回應訊息多語系化
- [ ] **adminController.ts**
  - [ ] 登入錯誤訊息
  - [ ] 帳號鎖定訊息
  - [ ] 密碼變更訊息
- [ ] **questionController.ts**
  - [ ] 驗證錯誤訊息
  - [ ] 成功/失敗訊息
- [ ] **quizController.ts**
  - [ ] 測驗建立/提交訊息
- [ ] **leaderboardController.ts**
  - [ ] 排行榜提交訊息
  - [ ] 驗證錯誤訊息
- [ ] **errorHandler.ts**
  - [ ] 通用錯誤訊息

### ✅ Rate Limiter 錯誤訊息
- [ ] 修改 `server/src/middleware/rateLimiter.ts`
  - [ ] 根據請求語言回傳對應錯誤訊息

---

## 第三階段：資料庫內容多語系

### ✅ 資料庫結構調整（方案選擇）

**決定採用：嵌入式多語言結構（方案 A）**

### ✅ Question Model 調整
- [ ] 修改 `server/src/models/Question.ts`
  ```typescript
  question: {
    "zh-TW": string,
    "en": string
  }
  options: {
    "zh-TW": string[],
    "en": string[]
  }
  explanation: {
    "zh-TW": string,
    "en": string
  }
  ```

### ✅ Book Model 調整
- [ ] 修改 `server/src/models/Book.ts`
  ```typescript
  displayName: {
    "zh-TW": string,
    "en": string
  }
  ```

### ✅ 資料遷移腳本
- [ ] 建立 `server/src/scripts/migrate-to-multilingual.ts`
  - [ ] 將現有題目轉換為多語言格式
  - [ ] 保留原中文內容在 `zh-TW` 欄位
  - [ ] 英文欄位暫時設為 `[Translation needed]`
- [ ] 執行遷移並備份原始資料

### ✅ API 修改
- [ ] 修改 `questionController.ts`
  - [ ] GET `/api/questions` 根據語言參數回傳對應版本
  - [ ] 後端根據 `req.language` 過濾資料
- [ ] 修改 `bookController.ts`
  - [ ] 書籍列表根據語言回傳對應名稱

---

## 第四階段：管理後台多語系支援

### ✅ 題目管理介面調整
- [ ] 修改 `QuestionBank.tsx` - 新增/編輯表單
  - [ ] 加入語言 Tab 切換（中文 / English）
  - [ ] 每個語言獨立輸入欄位
  - [ ] 顯示翻譯完成度指示器
  - [ ] 支援單一語言儲存（允許部分翻譯）

### ✅ 書籍管理介面調整
- [ ] 修改書籍新增/編輯表單
  - [ ] 書籍名稱支援雙語輸入
  - [ ] 顯示名稱預覽（兩種語言）

### ✅ 翻譯工具整合（可選）
- [ ] 建立翻譯輔助功能
  - [ ] 「快速翻譯」按鈕（使用 Google Translate API）
  - [ ] 翻譯建議（供人工校對）
  - [ ] 批量翻譯功能（針對大量題目）

---

## 第五階段：測試與優化

### ✅ 翻譯完整性檢查
- [ ] 建立 `scripts/check-translations.ts` 腳本
  - [ ] 掃描所有語言檔，找出缺失的 key
  - [ ] 檢查資料庫中未翻譯的題目數量
  - [ ] 生成翻譯進度報告

### ✅ ESLint 規則（防止硬編碼）
- [ ] 安裝 `eslint-plugin-i18next`
- [ ] 設定規則偵測未使用 `t()` 的硬編碼字串

### ✅ 效能優化
- [ ] 語言檔懶加載（按需載入）
- [ ] 預先載入常用語言
- [ ] 測試語言切換效能（應 < 200ms）

### ✅ SEO 優化（可選）
- [ ] 使用 `react-helmet-async` 設定 `<html lang="zh-TW">` 或 `<html lang="en">`
- [ ] 設定多語言 meta tags

### ✅ 完整測試
- [ ] 前端所有頁面切換語言測試
- [ ] 後端 API 多語言回應測試
- [ ] 資料庫題目多語言查詢測試
- [ ] 跨瀏覽器測試（Chrome, Firefox, Safari, Edge）
- [ ] 行動裝置測試（iOS, Android）

---

## 第六階段：內容翻譯

### ✅ 翻譯準備工作
- [ ] 統計需翻譯的題目總數
- [ ] 建立翻譯風格指南（術語統一、語氣等）
- [ ] 決定翻譯方式：
  - 選項 A：人工翻譯（品質最好）
  - 選項 B：AI 輔助 + 人工校對（平衡速度與品質）
  - 選項 C：純機器翻譯（最快但需大量校對）

### ✅ 題目內容翻譯
- [ ] 翻譯題目文字（question）
- [ ] 翻譯選項（options）
- [ ] 翻譯解析（explanation）
- [ ] 翻譯書籍名稱

### ✅ 專業術語統一
- [ ] 建立醫療靈媒專業術語對照表
  - 例如：「celery juice」→「西洋芹汁」
  - 例如：「liver」→「肝臟」
- [ ] 確保所有翻譯使用統一術語

---

## 📊 進度追蹤

| 階段 | 預估時間 | 狀態 | 完成日期 |
|------|----------|------|----------|
| 第一階段：前端 MVP | 2-3 天 | ⏳ 未開始 | - |
| 第二階段：後端 API | 1 天 | ⏳ 未開始 | - |
| 第三階段：資料庫結構 | 1-2 天 | ⏳ 未開始 | - |
| 第四階段：管理後台 | 1-2 天 | ⏳ 未開始 | - |
| 第五階段：測試優化 | 1 天 | ⏳ 未開始 | - |
| 第六階段：內容翻譯 | 1-2 週 | ⏳ 未開始 | - |

**總預估時間：2-3 週**（取決於題目數量和翻譯方式）

---

## 🚀 快速啟動建議

### 最小可行產品（MVP）優先
建議先完成 **第一階段**，讓使用者可以切換語言（即使題目內容還是中文），這樣可以：
1. 快速驗證多語系架構可行性
2. 讓使用者先體驗語言切換功能
3. 逐步翻譯內容，而非一次性完成

### 漸進式翻譯策略
- 先翻譯最熱門的書籍題目
- 英文題目標記「🌐 中文版」提示，引導使用者切換語言
- 每週翻譯一定數量的題目，逐步完善

---

## 📝 注意事項

1. **翻譯品質 > 速度**：醫療靈媒涉及專業知識，錯誤翻譯可能誤導讀者
2. **文化適配**：某些概念可能需要調整，而非直譯
3. **排版考量**：英文和中文字元長度差異可能影響 UI 排版
4. **測試覆蓋**：確保每個語言版本都經過完整測試

---

## 🔗 相關資源

- [react-i18next 官方文檔](https://react.i18next.com/)
- [i18next 最佳實踐](https://www.i18next.com/principles/best-practices)
- [Google Translate API](https://cloud.google.com/translate/docs)
- [醫學術語翻譯參考](https://www.termonline.cn/)
