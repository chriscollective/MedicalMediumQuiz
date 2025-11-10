/**
 * 工具函數集合
 */

/**
 * 將數字格式化為百分比
 * @param value 數值（0-100）
 * @returns 格式化的百分比字串
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * 檢查分數是否及格（60分以上）
 * @param score 得分
 * @param total 總分
 * @returns 是否及格
 */
export function isPass(score: number, total: number): boolean {
  if (total === 0) return false;
  const percentage = (score / total) * 100;
  return percentage >= 60;
}

/**
 * 計算等級
 * @param score 得分
 * @param total 總分
 * @returns 等級 (S/A+/A/B+/B/C+/F)
 */
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
