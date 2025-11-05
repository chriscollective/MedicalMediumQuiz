import { Request, Response, NextFunction } from 'express';
import Question from '../models/Question';
import Quiz from '../models/Quiz';
import mongoose from 'mongoose';

type CacheEntry<T> = {
  expires: number;
  data: T;
};

const analyticsCache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS =
  Number(process.env.ANALYTICS_OVERVIEW_CACHE_TTL_MS) || 45_000;

function getCache<T>(key: string): T | null {
  const entry = analyticsCache.get(key);
  if (!entry) {
    return null;
  }
  if (entry.expires < Date.now()) {
    analyticsCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T) {
  analyticsCache.set(key, {
    expires: Date.now() + CACHE_TTL_MS,
    data
  });
}

/**
 * Helper: 聚合取得統計摘要
 */
async function computeAnalyticsSummary() {
  const uniqueUsers = await Quiz.distinct('userId');
  const totalUsers = uniqueUsers.length;

  const difficultyStats = await Quiz.aggregate([
    {
      $group: {
        _id: '$difficulty',
        count: { $sum: 1 }
      }
    }
  ]);

  const difficultyMap = new Map(
    difficultyStats.map(stat => [stat._id, stat.count])
  );

  const beginnerCount = difficultyMap.get('初階') || 0;
  const advancedCount = difficultyMap.get('進階') || 0;
  const totalQuizzes = beginnerCount + advancedCount;

  const beginnerPercentage = totalQuizzes > 0
    ? Math.round((beginnerCount / totalQuizzes) * 100)
    : 0;

  const correctRateStats = await Quiz.aggregate([
    {
      $group: {
        _id: null,
        avgCorrectCount: { $avg: '$correctCount' }
      }
    }
  ]);

  const avgCorrectRate = correctRateStats.length > 0
    ? Math.floor((correctRateStats[0].avgCorrectCount / 20) * 1000) / 10
    : 0;

  const avgGrade = calculateGradeFromScore(avgCorrectRate);

  const bookStats = await Quiz.aggregate([
    {
      $group: {
        _id: '$book',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 1
    }
  ]);

  const mostPopularBook = bookStats.length > 0
    ? {
        book: bookStats[0]._id,
        count: bookStats[0].count
      }
    : null;

  return {
    totalUsers,
    totalQuizzes,
    difficultyDistribution: {
      beginner: beginnerCount,
      advanced: advancedCount,
      beginnerPercentage
    },
    avgCorrectRate,
    avgGrade,
    mostPopularBook
  };
}

/**
 * Helper: 取得等級分布資料
 */
async function computeGradeDistribution() {
  const gradeOrder = ['S', 'A+', 'A', 'B+', 'B', 'C+', 'F'];

  const results = await Quiz.aggregate<
    { _id: string; count: number }
  >([
    {
      $project: {
        grade: {
          $switch: {
            branches: [
              { case: { $eq: ['$totalScore', 100] }, then: 'S' },
              { case: { $gte: ['$totalScore', 90] }, then: 'A+' },
              { case: { $gte: ['$totalScore', 80] }, then: 'A' },
              { case: { $gte: ['$totalScore', 70] }, then: 'B+' },
              { case: { $gte: ['$totalScore', 60] }, then: 'B' },
              { case: { $gte: ['$totalScore', 50] }, then: 'C+' }
            ],
            default: 'F'
          }
        }
      }
    },
    {
      $group: {
        _id: '$grade',
        count: { $sum: 1 }
      }
    }
  ]);

  const distributionMap = new Map(results.map(item => [item._id, item.count]));

  return gradeOrder.map(name => ({
    name,
    value: distributionMap.get(name) || 0
  }));
}

/**
 * Helper: 取得書籍參與比例
 */
async function computeBookDistribution() {
  const bookStats = await Quiz.aggregate([
    {
      $group: {
        _id: '$book',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  return bookStats.map(stat => ({
    name: stat._id,
    value: stat.count
  }));
}

/**
 * Helper: 取得錯題排行榜
 */
async function computeWrongQuestions(limit = 10) {
  const results = await Quiz.aggregate<{
    questionId: mongoose.Types.ObjectId;
    question: string;
    book: string;
    totalAnswers: number;
    correctAnswers: number;
    correctRate: number;
  }>([
    {
      $match: {
        answerBitmap: { $type: 'string' }
      }
    },
    {
      $addFields: {
        answerArray: {
          $map: {
            input: { $range: [0, { $size: '$questions' }] },
            as: 'idx',
            in: { $substrCP: ['$answerBitmap', '$$idx', 1] }
          }
        }
      }
    },
    {
      $project: {
        questionAnswers: {
          $map: {
            input: { $range: [0, { $size: '$questions' }] },
            as: 'idx',
            in: {
              questionId: { $arrayElemAt: ['$questions', '$$idx'] },
              isCorrect: {
                $eq: [{ $arrayElemAt: ['$answerArray', '$$idx'] }, '1']
              }
            }
          }
        }
      }
    },
    {
      $unwind: '$questionAnswers'
    },
    {
      $group: {
        _id: '$questionAnswers.questionId',
        totalAnswers: { $sum: 1 },
        correctAnswers: {
          $sum: {
            $cond: ['$questionAnswers.isCorrect', 1, 0]
          }
        }
      }
    },
    {
      $lookup: {
        from: 'questions',
        localField: '_id',
        foreignField: '_id',
        as: 'question'
      }
    },
    {
      $unwind: '$question'
    },
    {
      $addFields: {
        questionText: '$question.question',
        book: '$question.book',
        correctRate: {
          $cond: [
            { $gt: ['$totalAnswers', 0] },
            {
              $divide: [
                {
                  $floor: {
                    $multiply: [
                      { $divide: ['$correctAnswers', '$totalAnswers'] },
                      1000
                    ]
                  }
                },
                10
              ]
            },
            0
          ]
        }
      }
    },
    {
      $sort: {
        correctRate: 1,
        totalAnswers: -1
      }
    },
    {
      $limit: limit
    },
    {
      $project: {
        _id: 0,
        questionId: { $toString: '$_id' },
        question: '$questionText',
        book: '$book',
        totalAnswers: 1,
        correctAnswers: 1,
        correctRate: 1
      }
    }
  ]);

  return results;
}

/**
 * 取得單一題目的統計資料
 * GET /api/analytics/questions/:questionId/stats
 */
export async function getQuestionStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { questionId } = req.params;

    // 驗證 questionId 格式
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid question ID format'
      });
    }

    // 檢查題目是否存在
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    // 從 Quiz 記錄中統計該題目的作答資料
    // 找出所有包含該題目的測驗
    const quizzes = await Quiz.find({
      questions: new mongoose.Types.ObjectId(questionId)
    }).lean();

    let totalAnswers = 0;
    let correctAnswers = 0;

    // 遍歷每個測驗，檢查該題目在 questions 陣列中的位置，並查看 bitmap 對應位置
    for (const quiz of quizzes) {
      const questionIndex = quiz.questions.findIndex(
        (qId: mongoose.Types.ObjectId) => qId.toString() === questionId
      );

      if (questionIndex !== -1 && quiz.answerBitmap && quiz.answerBitmap.length === 20) {
        totalAnswers++;
        if (quiz.answerBitmap[questionIndex] === '1') {
          correctAnswers++;
        }
      }
    }

    // 計算正確率（百分比，無條件捨去到小數點後一位）
    const correctRate = totalAnswers > 0
      ? Math.floor((correctAnswers / totalAnswers) * 1000) / 10
      : 0;

    res.json({
      success: true,
      data: {
        questionId,
        totalAnswers,
        correctAnswers,
        incorrectAnswers: totalAnswers - correctAnswers,
        correctRate
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 批次取得多個題目的統計資料
 * POST /api/analytics/questions/stats
 * Body: { questionIds: string[] }
 */
export async function getQuestionsStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { questionIds } = req.body;

    // 驗證輸入
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'questionIds must be a non-empty array'
      });
    }

    // 驗證所有 ID 格式
    const invalidIds = questionIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid question ID format',
        invalidIds
      });
    }

    // 找出所有包含這些題目的測驗
    const questionObjectIds = questionIds.map(id => new mongoose.Types.ObjectId(id));
    const quizzes = await Quiz.find({
      questions: { $in: questionObjectIds }
    }).lean();

    // 建立統計 map，key 為 questionId
    const statsMap = new Map<string, { totalAnswers: number; correctAnswers: number }>();

    // 初始化所有題目的統計資料
    questionIds.forEach(qId => {
      statsMap.set(qId, { totalAnswers: 0, correctAnswers: 0 });
    });

    // 遍歷每個測驗，統計每個題目的答對情況
    for (const quiz of quizzes) {
      if (!quiz.answerBitmap || quiz.answerBitmap.length !== 20) {
        continue;
      }

      quiz.questions.forEach((qId: mongoose.Types.ObjectId, index: number) => {
        const questionId = qId.toString();
        const stats = statsMap.get(questionId);

        if (stats) {
          stats.totalAnswers++;
          if (quiz.answerBitmap[index] === '1') {
            stats.correctAnswers++;
          }
        }
      });
    }

    // 建立結果陣列
    const results = questionIds.map(questionId => {
      const stat = statsMap.get(questionId);
      if (stat && stat.totalAnswers > 0) {
        const correctRate = Math.floor((stat.correctAnswers / stat.totalAnswers) * 1000) / 10;
        return {
          questionId,
          totalAnswers: stat.totalAnswers,
          correctAnswers: stat.correctAnswers,
          incorrectAnswers: stat.totalAnswers - stat.correctAnswers,
          correctRate
        };
      } else {
        // 沒有作答記錄
        return {
          questionId,
          totalAnswers: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
          correctRate: 0
        };
      }
    });

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 取得統計摘要
 * GET /api/analytics/summary
 */
export async function getAnalyticsSummary(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({
      success: true,
      data: await computeAnalyticsSummary()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 取得等級分布
 * GET /api/analytics/grade-distribution
 */
export async function getGradeDistribution(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({
      success: true,
      data: await computeGradeDistribution()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 取得書籍參與比例
 * GET /api/analytics/book-distribution
 */
export async function getBookDistribution(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({
      success: true,
      data: await computeBookDistribution()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 取得錯題排行榜（正確率最低的題目）
 * GET /api/analytics/wrong-questions
 * @query limit - 回傳數量限制（預設 10）
 */
export async function getWrongQuestions(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    res.json({
      success: true,
      data: await computeWrongQuestions(limit)
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 取得綜合統計概覽
 * GET /api/analytics/overview
 * @query limit - 錯題排行榜回傳數量（預設 10）
 */
export async function getAnalyticsOverview(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const cacheKey = `analytics:overview:${limit}`;
    const cached = getCache<{
      summary: Awaited<ReturnType<typeof computeAnalyticsSummary>>;
      gradeDistribution: Awaited<ReturnType<typeof computeGradeDistribution>>;
      bookDistribution: Awaited<ReturnType<typeof computeBookDistribution>>;
      wrongQuestions: Awaited<ReturnType<typeof computeWrongQuestions>>;
    }>(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached,
        meta: { cache: 'hit', ttlMs: CACHE_TTL_MS }
      });
    }

    const [
      summary,
      gradeDistribution,
      bookDistribution,
      wrongQuestions
    ] = await Promise.all([
      computeAnalyticsSummary(),
      computeGradeDistribution(),
      computeBookDistribution(),
      computeWrongQuestions(limit)
    ]);

    const payload = {
      summary,
      gradeDistribution,
      bookDistribution,
      wrongQuestions
    };

    setCache(cacheKey, payload);

    res.json({
      success: true,
      data: payload,
      meta: { cache: 'miss', ttlMs: CACHE_TTL_MS }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 取得高分排行榜
 * GET /api/analytics/leaderboard
 * @query book - 書籍名稱（神奇西芹汁/搶救肝臟/改變生命的食物/綜合）
 * @query limit - 回傳數量限制（預設 10）
 */
export async function getLeaderboard(req: Request, res: Response, next: NextFunction) {
  try {
    const book = req.query.book as string;
    const limit = parseInt(req.query.limit as string) || 10;

    let query: any = {};

    // 根據書籍篩選
    if (book && book !== '綜合') {
      // 單一書籍排行榜
      query.book = book;
    } else if (book === '綜合') {
      // 綜合排行榜：book 欄位包含逗號（代表選了多本書）
      query.book = { $regex: ',' };
    }

    // 查詢所有記錄（先不排序，待會在程式中排序）
    const quizzes = await Quiz.find(query)
      .select('userId book difficulty totalScore correctCount createdAt')
      .lean();

    // 定義等級優先順序
    const gradeOrder: Record<string, number> = {
      'S': 1,
      'A+': 2,
      'A': 3,
      'B+': 4,
      'B': 5,
      'C+': 6,
      'F': 7
    };

    // 定義難度優先順序
    const difficultyOrder: Record<string, number> = {
      '進階': 1,
      '初階': 2
    };

    // 計算每個記錄的等級並排序
    const quizzesWithGrade = quizzes.map(quiz => ({
      ...quiz,
      grade: calculateGradeFromScore(quiz.totalScore)
    }));

    // 排序：第一順位是等級（grade），第二順位是難度（difficulty），第三順位是時間（createdAt）
    quizzesWithGrade.sort((a, b) => {
      const gradeA = gradeOrder[a.grade];
      const gradeB = gradeOrder[b.grade];

      // 1. 先比較等級
      if (gradeA !== gradeB) {
        return gradeA - gradeB; // 數字越小（等級越高）排越前面
      }

      // 2. 等級相同時，比較難度（進階優先）
      const diffA = difficultyOrder[a.difficulty] || 999;
      const diffB = difficultyOrder[b.difficulty] || 999;
      if (diffA !== diffB) {
        return diffA - diffB;
      }

      // 3. 等級和難度都相同時，比較時間（越早越前面）
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    // 取前 N 筆並格式化結果
    const topQuizzes = quizzesWithGrade.slice(0, limit);
    const leaderboard = topQuizzes.map((quiz, index) => ({
      rank: index + 1,
      userId: quiz.userId,
      book: quiz.book,
      difficulty: quiz.difficulty,
      score: quiz.totalScore,
      correctCount: quiz.correctCount,
      grade: quiz.grade,
      createdAt: quiz.createdAt
    }));

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 輔助函數：根據分數計算等級
 */
function calculateGradeFromScore(score: number): string {
  if (score === 100) return 'S';
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C+';
  return 'F';
}
