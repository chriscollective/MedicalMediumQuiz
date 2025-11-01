import express, { Request, Response } from 'express';
import Book from '../models/Book';
import { authenticate } from '../middleware/auth';

const router = express.Router();

/**
 * @route   POST /api/books
 * @desc    新增書籍
 * @access  Private (需要管理員權限)
 */
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    // 驗證書籍名稱
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        message: '書籍名稱為必填'
      });
    }

    // 檢查書籍是否已存在
    const existingBook = await Book.findOne({ name: name.trim() });
    if (existingBook) {
      return res.status(409).json({
        message: '此書籍已存在'
      });
    }

    // 建立新書籍
    const newBook = new Book({
      name: name.trim()
    });

    await newBook.save();

    res.status(201).json({
      message: '書籍新增成功',
      book: newBook
    });

  } catch (error: any) {
    console.error('新增書籍錯誤:', error);

    // 處理 Mongoose 驗證錯誤
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: '資料驗證失敗',
        errors: error.errors
      });
    }

    // 處理重複鍵錯誤
    if (error.code === 11000) {
      return res.status(409).json({
        message: '此書籍已存在'
      });
    }

    res.status(500).json({
      message: '伺服器錯誤，無法新增書籍'
    });
  }
});

/**
 * @route   GET /api/books
 * @desc    取得所有書籍列表
 * @access  Public
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .select('name createdAt');

    res.json({
      books,
      count: books.length
    });

  } catch (error) {
    console.error('取得書籍列表錯誤:', error);
    res.status(500).json({
      message: '伺服器錯誤，無法取得書籍列表'
    });
  }
});

export default router;
