import { formatPercentage, isPass, calculateGrade } from '../helpers';

describe('formatPercentage', () => {
  test('應該將數字格式化為百分比', () => {
    expect(formatPercentage(85)).toBe('85%');
  });

  test('應該四捨五入到整數', () => {
    expect(formatPercentage(85.6)).toBe('86%');
    expect(formatPercentage(85.4)).toBe('85%');
  });

  test('應該處理 0', () => {
    expect(formatPercentage(0)).toBe('0%');
  });

  test('應該處理 100', () => {
    expect(formatPercentage(100)).toBe('100%');
  });
});

describe('isPass', () => {
  test('60% 以上應該及格', () => {
    expect(isPass(12, 20)).toBe(true);  // 60%
    expect(isPass(15, 20)).toBe(true);  // 75%
    expect(isPass(20, 20)).toBe(true);  // 100%
  });

  test('60% 以下應該不及格', () => {
    expect(isPass(11, 20)).toBe(false); // 55%
    expect(isPass(0, 20)).toBe(false);  // 0%
  });

  test('總分為 0 應該不及格', () => {
    expect(isPass(10, 0)).toBe(false);
  });
});

describe('calculateGrade', () => {
  test('總分為 0 應該回傳 F', () => {
    expect(calculateGrade(10, 0)).toBe('F');
  });

  test('90% 以上應該回傳 S', () => {
    expect(calculateGrade(18, 20)).toBe('S');
    expect(calculateGrade(20, 20)).toBe('S');
  });

  test('85-89% 應該回傳 A+', () => {
    expect(calculateGrade(17, 20)).toBe('A+');
    expect(calculateGrade(17.8, 20)).toBe('A+');
  });

  test('80-84% 應該回傳 A', () => {
    expect(calculateGrade(16, 20)).toBe('A');
    expect(calculateGrade(16.8, 20)).toBe('A');
  });

  test('75-79% 應該回傳 B+', () => {
    expect(calculateGrade(15, 20)).toBe('B+');
    expect(calculateGrade(15.8, 20)).toBe('B+');
  });

  test('70-74% 應該回傳 B', () => {
    expect(calculateGrade(14, 20)).toBe('B');
    expect(calculateGrade(14.8, 20)).toBe('B');
  });

  test('60-69% 應該回傳 C+', () => {
    expect(calculateGrade(12, 20)).toBe('C+');
    expect(calculateGrade(13.8, 20)).toBe('C+');
  });

  test('60% 以下應該回傳 F', () => {
    expect(calculateGrade(11, 20)).toBe('F');
    expect(calculateGrade(0, 20)).toBe('F');
  });
});
