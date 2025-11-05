# 效能紀錄

## 2025-11-05

- **數據分析（Analytics）**
  - 原本四支 API 並行請求：`耗時 ≈ 6082 ms`（首次記錄）
  - 合併 `/api/analytics/overview` 後：`耗時 ≈ 5485 ms`
  - 啟用 MongoDB 聚合 + 45 秒快取 + 新索引：`耗時 ≈ 480 ms`

- **排行榜（Leaderboard）**
  - `getAllLeaderboards` 合併請求：`耗時 ≈ 52 ms`

- **題庫（Question Bank）**
  - 全量題目 + 統計（含 `/analytics/questions/stats`）：`耗時 ≈ 301 ms`

- **測驗抽題（Quiz）**
  - 單一本書：`題數 20，耗時 ≈ 53 ms`
  - 兩本混合：`題數 20，耗時 ≈ 106 ms`
  - 三本混合（進階）：`題數 20，耗時 ≈ 145 ms`

> 註：時間來自瀏覽器 Console 日誌（同日時測試）；快取開啟時若在 TTL 內重複刷新，會顯示更低的耗時（如 23 ms）。若要比較未快取的情況，需在快取過期後或手動清除後再量測。***
