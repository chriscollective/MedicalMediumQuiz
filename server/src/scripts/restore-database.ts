import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import readline from "readline";

// 載入環境變數
dotenv.config({ path: path.join(__dirname, "../../../.env") });

const execAsync = promisify(exec);

/**
 * MongoDB 資料還原腳本
 * ⚠️ 警告：這會覆蓋現有資料！
 */

// 創建命令列輸入介面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promise 化的 question
function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function restoreDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI 環境變數未設定");
    process.exit(1);
  }

  const backupDir = path.join(__dirname, "../../backups");

  // 列出所有可用的備份
  console.log("📁 可用的備份：");
  console.log("=".repeat(60));

  if (!fs.existsSync(backupDir)) {
    console.error("❌ 備份目錄不存在:", backupDir);
    process.exit(1);
  }

  const backups = fs
    .readdirSync(backupDir)
    .filter((item) => {
      const itemPath = path.join(backupDir, item);
      return fs.statSync(itemPath).isDirectory();
    })
    .sort()
    .reverse(); // 最新的在前面

  if (backups.length === 0) {
    console.error("❌ 沒有找到任何備份");
    process.exit(1);
  }

  backups.forEach((backup, index) => {
    const backupPath = path.join(backupDir, backup);
    const stats = fs.statSync(backupPath);
    const date = stats.mtime.toLocaleString("zh-TW");
    console.log(`${index + 1}. ${backup} (建立時間: ${date})`);
  });

  console.log("=".repeat(60));

  // 讓使用者選擇要還原的備份
  const choice = await question(
    "\n請輸入要還原的備份編號 (或輸入 'q' 取消): "
  );

  if (choice.toLowerCase() === "q") {
    console.log("❌ 取消還原");
    rl.close();
    process.exit(0);
  }

  const selectedIndex = parseInt(choice) - 1;

  if (
    isNaN(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex >= backups.length
  ) {
    console.error("❌ 無效的選擇");
    rl.close();
    process.exit(1);
  }

  const selectedBackup = backups[selectedIndex];
  const restorePath = path.join(backupDir, selectedBackup);

  console.log(`\n⚠️  您選擇了: ${selectedBackup}`);
  console.log("⚠️  警告：這將會覆蓋資料庫中的所有現有資料！");

  const confirm = await question(
    '\n確定要繼續嗎？輸入 "YES" 確認: '
  );

  if (confirm !== "YES") {
    console.log("❌ 取消還原（必須輸入大寫 YES）");
    rl.close();
    process.exit(0);
  }

  rl.close();

  console.log("\n🔄 開始還原資料庫...");
  console.log(`📁 還原來源: ${restorePath}`);

  try {
    // 執行 mongorestore
    const command = `mongorestore --uri="${MONGODB_URI}" --drop "${restorePath}"`;

    console.log("\n⏳ 正在還原資料...");

    const { stdout, stderr } = await execAsync(command);

    if (stderr && !stderr.includes("done")) {
      console.warn("⚠️ 還原警告:", stderr);
    }

    console.log("\n✅ 資料庫還原完成！");
    console.log(stdout);

    console.log("\n📊 還原摘要：");
    console.log("=".repeat(60));

    // 解析輸出，統計還原的文件數量
    const lines = stdout.split("\n");
    let totalDocs = 0;

    lines.forEach((line) => {
      const match = line.match(/(\d+) document\(s\)/);
      if (match) {
        totalDocs += parseInt(match[1]);
      }
    });

    console.log(`總共還原: ${totalDocs} 筆文件`);
    console.log("=".repeat(60));

    console.log("\n✅ 還原成功！建議：");
    console.log("   1. 重啟應用程式伺服器");
    console.log("   2. 清除瀏覽器快取");
    console.log("   3. 測試主要功能是否正常");

  } catch (error: any) {
    console.error("\n❌ 還原失敗:", error.message);
    console.error("\n💡 可能的原因：");
    console.error("   1. 備份檔案損壞");
    console.error("   2. MongoDB URI 不正確");
    console.error("   3. 網路連線問題");
    console.error("   4. mongorestore 未安裝");
    process.exit(1);
  }
}

// 執行還原
restoreDatabase().catch((error) => {
  console.error("❌ 還原過程發生錯誤:", error);
  process.exit(1);
});
