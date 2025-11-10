import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";

// 載入環境變數
dotenv.config({ path: path.join(__dirname, "../../../.env") });

/**
 * 檢查資料庫統計資訊
 */
async function checkDatabaseStats() {
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

    // 取得所有 collections
    const collections = await db.listCollections().toArray();

    console.log("📊 資料庫統計資訊");
    console.log("=".repeat(60));

    let totalDocuments = 0;
    let totalSize = 0;

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);

      // 取得文件數量
      const count = await collection.countDocuments();

      // 取得 collection 統計資訊
      const stats = await db.command({ collStats: collectionName });

      totalDocuments += count;
      totalSize += stats.size;

      console.log(`\n📁 Collection: ${collectionName}`);
      console.log(`   文件數量: ${count.toLocaleString()} 筆`);
      console.log(`   儲存大小: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`   索引大小: ${(stats.totalIndexSize / 1024).toFixed(2)} KB`);
    }

    console.log("\n" + "=".repeat(60));
    console.log(`📊 總計:`);
    console.log(`   Collections: ${collections.length} 個`);
    console.log(`   總文件數: ${totalDocuments.toLocaleString()} 筆`);
    console.log(`   總儲存大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log("=".repeat(60));

    // 顯示預期備份大小
    const expectedBackupSize = (totalSize * 0.8) / 1024 / 1024; // BSON 通常比實際儲存小 20%
    console.log(`\n💾 預期備份大小: 約 ${expectedBackupSize.toFixed(2)} MB`);

  } catch (error: any) {
    console.error("❌ 錯誤:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n✅ 已關閉資料庫連線");
  }
}

// 執行檢查
checkDatabaseStats();
