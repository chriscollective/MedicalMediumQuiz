import dotenv from "dotenv";
import mongoose from "mongoose";
import Question, { IQuestion } from "../models/Question";

dotenv.config();

function normalizeFillCorrectAnswer(
  question: IQuestion & mongoose.Document
): number | null {
  const raw = question.correctAnswer;
  if (typeof raw === "number" && Number.isInteger(raw)) {
    return raw;
  }
  if (typeof raw === "string") {
    const parsed = Number(raw);
    return Number.isInteger(parsed) ? parsed : null;
  }
  return null;
}

async function cloneFillQuestion(question: IQuestion & mongoose.Document) {
  if (!question.fillOptions || question.fillOptions.length === 0) {
    console.warn(
      `⚠️  跳過題目 ${question._id}：fillOptions 為空，無法轉換為克漏字。`
    );
    return false;
  }

  const correctIndex = normalizeFillCorrectAnswer(question);
  if (
    correctIndex === null ||
    correctIndex < 0 ||
    correctIndex >= question.fillOptions.length
  ) {
    console.warn(
      `⚠️  跳過題目 ${question._id}：correctAnswer 無法解析 (${question.correctAnswer}).`
    );
    return false;
  }

  const existing = await Question.findOne({
    type: "cloze",
    clonedFrom: question._id,
  }).lean();

  if (existing) {
    console.log(
      `ℹ️  題目 ${question._id} 已有對應的克漏字題 (${existing._id})，略過。`
    );
    return false;
  }

  const options = question.fillOptions
    .map((opt) => String(opt ?? "").trim())
    .filter((opt) => opt.length > 0)
    .slice(0, 6); // 與現有克漏字題一致，最多 6 個

  if (options.length === 0) {
    console.warn(
      `⚠️  跳過題目 ${question._id}：填空選項經清理後為空，無法轉換。`
    );
    return false;
  }

  const clozeQuestion = new Question({
    type: "cloze",
    question: question.question,
    options,
    correctAnswer: [correctIndex],
    source: question.source,
    explanation: question.explanation,
    difficulty: question.difficulty,
    book: question.book,
    createdBy: question.createdBy ?? "system",
    updatedBy: question.updatedBy ?? question.createdBy ?? "system",
    clonedFrom: question._id,
  });

  await clozeQuestion.save();
  console.log(
    `✅ 已複製題目 ${question._id} → 新克漏字題 ${clozeQuestion._id}.`
  );
  return true;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ 未設定 MONGODB_URI，請先在環境變數或 .env 中設定。");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("✅ 已連線至 MongoDB");

  try {
    const fillQuestions = await Question.find({ type: "fill" }).exec();
    console.log(`🔍 找到 ${fillQuestions.length} 題填空題，開始轉換...`);

    let successCount = 0;
    let skipCount = 0;

    for (const question of fillQuestions) {
      const result = await cloneFillQuestion(question);
      if (result) {
        successCount += 1;
      } else {
        skipCount += 1;
      }
    }

    console.log("🎉 完成複製作業");
    console.log(`   👉 新增克漏字題：${successCount}`);
    console.log(`   👉 略過/失敗：${skipCount}`);
  } catch (error) {
    console.error("❌ 執行過程發生錯誤：", error);
  } finally {
    await mongoose.disconnect();
    console.log("👋 已斷開 MongoDB 連線");
  }
}

main().catch((error) => {
  console.error("❌ 未預期的錯誤：", error);
  process.exit(1);
});
