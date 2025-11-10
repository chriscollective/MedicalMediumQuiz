import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import readline from "readline";

// 載入環境變數
dotenv.config({ path: path.join(__dirname, "../../../.env") });

/**
 * 選擇性清空 Collections 腳本
 * 用於清空測試資料，保留重要資料（題目、管理員）
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

// 可清空的 collections 配置
interface CollectionConfig {
  name: string;
  displayName: string;
  description: string;
  danger: "low" | "medium" | "high";
}

const CLEARABLE_COLLECTIONS: CollectionConfig[] = [
  {
    name: "quizzes",
    displayName: "測驗記錄",
    description: "所有使用者的測驗記錄",
    danger: "medium",
  },
  {
    name: "leaderboards",
    displayName: "排行榜",
    description: "所有排行榜資料",
    danger: "medium",
  },
  {
    name: "reports",
    displayName: "問題回報",
    description: "使用者回報的問題",
    danger: "low",
  },
];

// ❌ 不可清空的 collections（保護重要資料）
const PROTECTED_COLLECTIONS = ["questions", "admins", "books"];

async function clearCollections() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI 環境變數未設定");
    process.exit(1);
  }

  try {
    console.log("🔄 連接資料庫...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ 連接成功\n");

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("無法取得資料庫連線");
    }

    // 顯示可清空的 collections
    console.log("🗑️  可清空的資料");
    console.log("=".repeat(70));

    for (let i = 0; i < CLEARABLE_COLLECTIONS.length; i++) {
      const config = CLEARABLE_COLLECTIONS[i];
      const collection = db.collection(config.name);
      const count = await collection.countDocuments();

      const dangerEmoji =
        config.danger === "high" ? "🔴" : config.danger === "medium" ? "🟡" : "🟢";

      console.log(
        `${i + 1}. ${dangerEmoji} ${config.displayName} (${config.name})`
      );
      console.log(`   說明: ${config.description}`);
      console.log(`   目前數量: ${count.toLocaleString()} 筆`);
      console.log();
    }

    console.log("=".repeat(70));
    console.log("\n🔒 受保護的資料（不可清空）：");
    console.log(`   ${PROTECTED_COLLECTIONS.join(", ")}\n`);
    console.log("=".repeat(70));

    // 讓使用者選擇要清空的 collections
    console.log("\n請選擇要清空的項目（可多選）：");
    console.log("輸入格式：數字用逗號分隔，例如 '1,2' 或 '1'");
    console.log("輸入 'all' 清空全部");
    console.log("輸入 'q' 取消");

    const choice = await question("\n請輸入: ");

    if (choice.toLowerCase() === "q") {
      console.log("❌ 取消清空");
      rl.close();
      await mongoose.connection.close();
      process.exit(0);
    }

    let selectedIndexes: number[] = [];

    if (choice.toLowerCase() === "all") {
      selectedIndexes = CLEARABLE_COLLECTIONS.map((_, i) => i);
    } else {
      const inputs = choice.split(",").map((s) => s.trim());
      for (const input of inputs) {
        const index = parseInt(input) - 1;
        if (
          !isNaN(index) &&
          index >= 0 &&
          index < CLEARABLE_COLLECTIONS.length
        ) {
          selectedIndexes.push(index);
        }
      }
    }

    if (selectedIndexes.length === 0) {
      console.error("❌ 無效的選擇");
      rl.close();
      await mongoose.connection.close();
      process.exit(1);
    }

    // 移除重複
    selectedIndexes = [...new Set(selectedIndexes)];

    const selectedCollections = selectedIndexes.map(
      (i) => CLEARABLE_COLLECTIONS[i]
    );

    // 顯示即將清空的資料
    console.log("\n⚠️  即將清空以下資料：");
    console.log("=".repeat(70));

    let totalDocs = 0;
    for (const config of selectedCollections) {
      const collection = db.collection(config.name);
      const count = await collection.countDocuments();
      totalDocs += count;
      console.log(`   ❌ ${config.displayName}: ${count.toLocaleString()} 筆`);
    }

    console.log("=".repeat(70));
    console.log(`   總計: ${totalDocs.toLocaleString()} 筆資料將被刪除\n`);

    // 最後確認
    const confirm = await question(
      '⚠️  確定要清空嗎？輸入 "DELETE" 確認（大寫）: '
    );

    if (confirm !== "DELETE") {
      console.log("❌ 取消清空（必須輸入大寫 DELETE）");
      rl.close();
      await mongoose.connection.close();
      process.exit(0);
    }

    rl.close();

    // 開始清空
    console.log("\n🔄 開始清空資料...\n");

    let deletedTotal = 0;

    for (const config of selectedCollections) {
      const collection = db.collection(config.name);
      const countBefore = await collection.countDocuments();

      console.log(`🗑️  清空 ${config.displayName} (${config.name})...`);

      const result = await collection.deleteMany({});

      deletedTotal += result.deletedCount || 0;

      console.log(
        `   ✅ 已刪除 ${result.deletedCount?.toLocaleString() || 0} 筆`
      );
    }

    console.log("\n" + "=".repeat(70));
    console.log(`✅ 清空完成！總共刪除 ${deletedTotal.toLocaleString()} 筆資料`);
    console.log("=".repeat(70));

    // 顯示剩餘資料統計
    console.log("\n📊 剩餘資料統計：");
    console.log("=".repeat(70));

    const allCollections = await db.listCollections().toArray();
    for (const collectionInfo of allCollections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();

      const isProtected = PROTECTED_COLLECTIONS.includes(collectionName);
      const emoji = isProtected ? "🔒" : "📁";

      console.log(
        `${emoji} ${collectionName}: ${count.toLocaleString()} 筆${
          isProtected ? " (受保護)" : ""
        }`
      );
    }

    console.log("=".repeat(70));

    console.log("\n✅ 操作完成！");
    console.log("💡 建議：");
    console.log("   1. 重啟應用程式伺服器");
    console.log("   2. 清除瀏覽器快取");
    console.log("   3. 測試功能是否正常");

  } catch (error: any) {
    console.error("\n❌ 清空失敗:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// 執行清空
clearCollections().catch((error) => {
  console.error("❌ 清空過程發生錯誤:", error);
  process.exit(1);
});
