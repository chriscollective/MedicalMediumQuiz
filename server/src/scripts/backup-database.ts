import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// 載入環境變數（從專案根目錄的 .env 檔案）
dotenv.config({ path: path.join(__dirname, "../../../.env") });

const execAsync = promisify(exec);

/**
 * MongoDB Atlas 免費版備份腳本
 * 使用 mongodump 導出資料到本地
 */

async function backupDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI 環境變數未設定");
    process.exit(1);
  }

  // 設定備份目錄和檔案名稱
  const backupDir = path.join(__dirname, "../../backups");
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .split("T")[0];
  const backupPath = path.join(backupDir, `backup_${timestamp}`);

  // 確保備份目錄存在
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log("🔄 開始備份資料庫...");
  console.log(`📁 備份路徑: ${backupPath}`);

  try {
    // 執行 mongodump
    const command = `mongodump --uri="${MONGODB_URI}" --out="${backupPath}"`;

    const { stdout, stderr } = await execAsync(command);

    if (stderr && !stderr.includes("done dumping")) {
      console.warn("⚠️ 備份警告:", stderr);
    }

    console.log("✅ 資料庫備份完成！");
    console.log(stdout);

    // 計算備份目錄的總大小
    const totalSize = calculateDirectorySize(backupPath);
    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`📦 備份大小: ${sizeInMB} MB`);

    // 統計檔案數量
    const fileCount = countFiles(backupPath);
    console.log(`📄 檔案數量: ${fileCount} 個`);

    // 清理舊備份（保留最近 30 天）
    cleanOldBackups(backupDir, 30);
  } catch (error: any) {
    console.error("❌ 備份失敗:", error.message);
    process.exit(1);
  }
}

/**
 * 遞迴計算目錄大小（包含所有子目錄和檔案）
 * @param dirPath 目錄路徑
 * @returns 總大小（bytes）
 */
function calculateDirectorySize(dirPath: string): number {
  let totalSize = 0;

  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      // 遞迴計算子目錄
      totalSize += calculateDirectorySize(itemPath);
    } else {
      // 累加檔案大小
      totalSize += stats.size;
    }
  }

  return totalSize;
}

/**
 * 計算目錄內的檔案數量
 * @param dirPath 目錄路徑
 * @returns 檔案數量
 */
function countFiles(dirPath: string): number {
  let count = 0;

  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      count += countFiles(itemPath);
    } else {
      count++;
    }
  }

  return count;
}

/**
 * 清理舊備份檔案
 * @param backupDir 備份目錄
 * @param daysToKeep 保留天數
 */
function cleanOldBackups(backupDir: string, daysToKeep: number) {
  const files = fs.readdirSync(backupDir);
  const now = Date.now();
  const maxAge = daysToKeep * 24 * 60 * 60 * 1000; // 轉換為毫秒

  let deletedCount = 0;

  files.forEach((file) => {
    const filePath = path.join(backupDir, file);
    const stats = fs.statSync(filePath);
    const age = now - stats.mtimeMs;

    if (age > maxAge) {
      // 刪除舊備份
      if (stats.isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
      deletedCount++;
      console.log(`🗑️  已刪除舊備份: ${file}`);
    }
  });

  if (deletedCount === 0) {
    console.log("✨ 無舊備份需要清理");
  } else {
    console.log(`✅ 已清理 ${deletedCount} 個舊備份`);
  }
}

// 執行備份
backupDatabase().catch((error) => {
  console.error("❌ 備份過程發生錯誤:", error);
  process.exit(1);
});
