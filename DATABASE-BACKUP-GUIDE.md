# MongoDB Atlas 免費版資料備份指南

## 📊 現況分析

### **您的環境：**
- **資料庫**：MongoDB Atlas 免費版（M0 Cluster）
- **儲存空間**：512 MB
- **自動備份**：❌ 不支援（需要 M10+ 付費版）

### **Code Review 建議（第 1154 行）：**
> ⚠️ **問題：缺少備份策略**
>
> 建議：設定自動備份 + 本地備份腳本

---

## 💡 針對免費版的備份方案

### **方案 A：定期 mongodump（已實作 ✅）**

**優點：**
- ✅ 完全免費
- ✅ 完整備份所有資料
- ✅ 可本地儲存或上傳雲端

**缺點：**
- ❌ 需要手動執行（或設定排程）
- ❌ 無法做到「即時備份」
- ❌ 備份期間資料庫仍在變動

---

## 🚀 使用方法

### **方法 1：使用 npm 腳本（推薦）**

```bash
# 執行備份
npm run backup

# 查看說明
npm run backup:help
```

**備份位置：** `server/backups/backup_YYYY-MM-DD/`

---

### **方法 2：使用 Windows 批次檔**

雙擊執行 `backup.bat` 檔案

---

### **方法 3：直接執行 TypeScript 腳本**

```bash
npx tsx server/src/scripts/backup-database.ts
```

---

## ⏰ 自動化備份

### **選項 A：Windows 工作排程器（推薦）**

**步驟：**

1. 打開「工作排程器」（Task Scheduler）
   - 按 Win + R，輸入 `taskschd.msc`

2. 點擊「建立基本工作」

3. 設定觸發程序：
   - 名稱：「MMQuiz 資料庫每日備份」
   - 觸發程序：每天凌晨 3:00

4. 設定動作：
   - 動作：啟動程式
   - 程式/指令碼：`C:\Users\Chris\Desktop\MMquiz\backup.bat`
   - 起始於：`C:\Users\Chris\Desktop\MMquiz`

5. 完成！

---

### **選項 B：使用 node-cron（程式化排程）**

安裝 node-cron：
```bash
npm install node-cron @types/node-cron
```

創建排程腳本：
```typescript
// server/src/scripts/backup-scheduler.ts
import cron from 'node-cron';
import { exec } from 'child_process';

// 每天凌晨 3:00 執行備份
cron.schedule('0 3 * * *', () => {
  console.log('🕐 開始執行每日備份...');
  exec('npm run backup', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ 備份失敗:', error);
      return;
    }
    console.log(stdout);
  });
});

console.log('✅ 備份排程已啟動（每天凌晨 3:00）');
```

---

## 📦 備份內容

### **完整備份包含：**

| Collection | 內容 | 重要性 |
|------------|------|--------|
| **questions** | 所有題目資料 | ⭐⭐⭐⭐⭐ 極重要 |
| **quizzes** | 測驗記錄 | ⭐⭐⭐⭐ 重要 |
| **leaderboards** | 排行榜資料 | ⭐⭐⭐⭐ 重要 |
| **admins** | 管理員帳號 | ⭐⭐⭐⭐⭐ 極重要 |
| **reports** | 問題回報 | ⭐⭐⭐ 中等 |
| **books** | 書籍資料 | ⭐⭐⭐⭐ 重要 |

---

## 🔄 還原資料

### **如果需要還原備份：**

```bash
# 還原整個資料庫
mongorestore --uri="YOUR_MONGODB_URI" --drop server/backups/backup_2025-11-10/

# 只還原特定 collection
mongorestore --uri="YOUR_MONGODB_URI" --nsInclude="mmquiz.questions" server/backups/backup_2025-11-10/
```

**⚠️ 注意：** `--drop` 會刪除現有資料！請謹慎使用。

---

## ☁️ 雲端備份（額外建議）

### **方案 B：上傳到雲端儲存（推薦組合使用）**

**為什麼需要雲端備份？**
- 💻 本地硬碟故障會失去所有備份
- 🔥 電腦損壞、遺失、被盜
- 📍 異地備份更安全

---

### **選項 1：Google Drive（推薦 ⭐）**

**優點：**
- ✅ 免費 15 GB
- ✅ 自動同步
- ✅ 版本歷史

**步驟：**
1. 安裝 [Google Drive 桌面版](https://www.google.com/drive/download/)
2. 設定同步資料夾
3. 將備份目錄放在 Google Drive 資料夾內

**修改備份腳本：**
```typescript
// 改為備份到 Google Drive
const backupDir = path.join('C:\\Users\\Chris\\Google Drive\\MMQuiz-Backups');
```

---

### **選項 2：GitHub 私有儲存庫**

**優點：**
- ✅ 完全免費（私有倉庫）
- ✅ 版本控制
- ✅ 可追蹤變更歷史

**步驟：**
1. 創建私有 GitHub repo：`mmquiz-backups`
2. 在備份後自動推送：

```bash
# server/src/scripts/backup-and-push.sh
#!/bin/bash
cd server/backups
git add .
git commit -m "Backup $(date +%Y-%m-%d)"
git push origin main
```

**⚠️ 注意：** 不要備份 `.env` 或包含密碼的檔案！

---

### **選項 3：Dropbox**

**優點：**
- ✅ 免費 2 GB
- ✅ 自動同步

**步驟：** 同 Google Drive

---

### **選項 4：AWS S3 / Backblaze B2**

**適合：** 如果備份檔案很大

**Backblaze B2：**
- 前 10 GB 免費
- 之後 $0.005/GB/月

---

## 📊 備份策略建議

### **3-2-1 原則（業界標準）**

- **3** 份備份副本
- **2** 種不同媒體（本地 + 雲端）
- **1** 份異地備份

---

### **建議的備份頻率：**

| 資料重要性 | 備份頻率 | 保留期限 |
|-----------|---------|---------|
| **極重要**（questions, admins） | 每天 | 90 天 |
| **重要**（quizzes, leaderboards） | 每週 | 30 天 |
| **中等**（reports） | 每月 | 30 天 |

---

### **實際執行計畫：**

```
每日凌晨 3:00
  → 執行 mongodump
  → 儲存到本地 server/backups/
  → 自動同步到 Google Drive
  → 保留最近 30 天的備份

每週日凌晨 4:00
  → 創建壓縮檔（.tar.gz）
  → 上傳到 GitHub 私有倉庫
  → 保留最近 12 週的備份

每月 1 號
  → 手動驗證備份可還原性
  → 檢查雲端儲存空間
```

---

## 🚨 災難恢復計畫

### **如果 MongoDB Atlas 資料被刪除：**

1. **立即停止所有寫入操作**
2. **聯絡 MongoDB Atlas 支援**（付費版可能有短期快照）
3. **從最近的備份還原**

```bash
# 1. 確認備份完整性
ls -lh server/backups/backup_2025-11-10/

# 2. 還原資料（會覆蓋現有資料）
mongorestore --uri="YOUR_MONGODB_URI" --drop server/backups/backup_2025-11-10/

# 3. 驗證資料完整性
# 登入 MongoDB Atlas 或使用 Compass 檢查
```

---

## 🔒 備份安全建議

### **⚠️ 重要：備份也要保護！**

1. **加密備份檔案**

```bash
# 使用 7-Zip 加密壓縮
7z a -p<password> -mhe=on backup.7z server/backups/backup_2025-11-10/
```

2. **不要備份敏感資訊**
   - ❌ `.env` 檔案
   - ❌ JWT_SECRET
   - ❌ 管理員密碼（已加密可以備份）

3. **限制存取權限**
   - 備份資料夾設定權限
   - 雲端儲存使用私有倉庫

---

## 📈 升級到付費版的考量

### **如果資料量增長，考慮升級到 M10：**

| 項目 | 免費版 M0 | 付費版 M10 |
|------|-----------|------------|
| **儲存空間** | 512 MB | 10 GB |
| **自動備份** | ❌ | ✅ 每日 |
| **Point-in-Time Recovery** | ❌ | ✅ 可回溯 |
| **價格** | 免費 | $57/月 |

**何時升級？**
- ✅ 資料接近 400 MB（80% 容量）
- ✅ 每日使用者超過 1000 人
- ✅ 無法承受資料遺失風險

---

## ✅ 檢查清單

### **每天：**
- [ ] 確認自動備份執行成功
- [ ] 檢查備份檔案大小正常

### **每週：**
- [ ] 檢查雲端同步狀態
- [ ] 清理過舊的備份檔案

### **每月：**
- [ ] **測試還原流程**（非常重要！）
- [ ] 檢查儲存空間使用量
- [ ] 審查備份策略是否需要調整

---

## 🆘 常見問題

### **Q1: mongodump 需要多久時間？**
**A:** 對於免費版（最多 512 MB），通常 1-3 分鐘。

---

### **Q2: 備份會影響網站效能嗎？**
**A:** 對免費版有輕微影響，建議在深夜（凌晨 3-5 點）執行。

---

### **Q3: 備份失敗怎麼辦？**
**A:** 檢查：
1. MongoDB URI 是否正確
2. 網路連線是否正常
3. 磁碟空間是否足夠
4. mongodump 是否已安裝

---

### **Q4: 可以只備份特定 collection 嗎？**
**A:** 可以！修改腳本：
```bash
mongodump --uri="$MONGODB_URI" --collection=questions --out="$BACKUP_PATH"
```

---

### **Q5: 備份檔案可以直接打開嗎？**
**A:** 不行，備份是 BSON 格式。需要使用 `mongorestore` 或 MongoDB Compass 導入。

---

## 📞 需要協助？

如果遇到問題：
1. 檢查 code review 建議（codeReview.md 第 1154 行）
2. 查看 MongoDB Atlas 文檔
3. 執行 `npm run backup:help`

---

## 📝 總結

### **您現在有：**
✅ 自動化備份腳本（`backup-database.ts`）
✅ 簡單的執行方式（`npm run backup`）
✅ Windows 批次檔（`backup.bat`）
✅ 自動清理舊備份（保留 30 天）

### **建議下一步：**
1. ⭐ **立即執行一次備份**（測試是否正常）
2. ⭐ **設定 Windows 工作排程器**（每日自動備份）
3. ⭐ **設定 Google Drive 同步**（雲端備份）
4. ⭐ **每月測試還原流程**（確保備份可用）

---

**最後提醒：**
> 💡 **備份的價值在於「還原」，而不是「儲存」。**
>
> 定期測試還原流程，確保備份真的可以用！

---

**建立日期：** 2025-11-10
**版本：** 1.0.0
