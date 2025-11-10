/**
 * Admin API 端點測試
 * 測試管理員登入、驗證等 API
 * @jest-environment node
 */

import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import adminRouter from '../admin';
import Admin from '../../models/Admin';

// 建立測試用的 Express app
const app = express();
app.use(express.json());
app.use('/api/admin', adminRouter);

describe('Admin API - POST /api/admin/login', () => {
  beforeAll(async () => {
    // ⚠️ 強制使用測試資料庫，絕不連接生產環境！
    const TEST_MONGO_URI = 'mongodb://localhost:27017/mmquiz-test';

    // 斷開現有連接（如果有的話）
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    // 連接到測試資料庫
    await mongoose.connect(TEST_MONGO_URI);
    console.log('✅ 測試：已連接到測試資料庫 (mmquiz-test)');

    // 清空測試資料庫
    await Admin.deleteMany({});
  });

  afterAll(async () => {
    // 清理測試資料
    await Admin.deleteMany({});
    await mongoose.connection.close();
    console.log('✅ 測試：已清理測試資料庫並斷開連接');
  });

  beforeEach(async () => {
    // 每個測試前清空資料（只清空測試資料庫）
    await Admin.deleteMany({});
  });

  describe('成功場景', () => {
    test('應該成功登入並返回 JWT token', async () => {
      // 建立測試管理員
      const admin = new Admin({
        username: 'testadmin',
        password: 'password123',
        isActive: true,
      });
      await admin.save();

      const response = await request(app)
        .post('/api/admin/login')
        .send({
          username: 'testadmin',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.admin).toHaveProperty('username', 'testadmin');
      expect(typeof response.body.data.token).toBe('string');
    });

    test('成功登入後應該重置登入嘗試次數', async () => {
      const admin = new Admin({
        username: 'testadmin',
        password: 'password123',
        isActive: true,
        loginAttempts: 3, // 之前有失敗過
      });
      await admin.save();

      await request(app)
        .post('/api/admin/login')
        .send({
          username: 'testadmin',
          password: 'password123',
        });

      // 驗證登入嘗試次數已重置
      const updatedAdmin = await Admin.findOne({ username: 'testadmin' });
      expect(updatedAdmin?.loginAttempts).toBe(0);
      expect(updatedAdmin?.lockUntil).toBeUndefined();
    });
  });

  describe('失敗場景 - 驗證', () => {
    test('缺少 username 應該返回 400', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('請提供');
    });

    test('缺少 password 應該返回 400', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          username: 'testadmin',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('請提供');
    });

    test('username 和 password 都缺少應該返回 400', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('失敗場景 - 認證', () => {
    test('不存在的帳號應該返回 401', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          username: 'nonexistent',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('使用者名稱或密碼錯誤');
    });

    test('密碼錯誤應該返回 401 並遞增嘗試次數', async () => {
      const admin = new Admin({
        username: 'testadmin',
        password: 'correctpassword',
        isActive: true,
      });
      await admin.save();

      const response = await request(app)
        .post('/api/admin/login')
        .send({
          username: 'testadmin',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('使用者名稱或密碼錯誤');
      expect(response.body).toHaveProperty('remainingAttempts');

      // 驗證嘗試次數已遞增
      const updatedAdmin = await Admin.findOne({ username: 'testadmin' });
      expect(updatedAdmin?.loginAttempts).toBe(1);
    });

    test('停用的帳號應該返回 403', async () => {
      const admin = new Admin({
        username: 'testadmin',
        password: 'password123',
        isActive: false, // 已停用
      });
      await admin.save();

      const response = await request(app)
        .post('/api/admin/login')
        .send({
          username: 'testadmin',
          password: 'password123',
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('已被停用');
    });
  });

  describe('失敗場景 - 帳號鎖定', () => {
    test('連續 5 次密碼錯誤應該鎖定帳號', async () => {
      const admin = new Admin({
        username: 'testadmin',
        password: 'correctpassword',
        isActive: true,
      });
      await admin.save();

      // 前 4 次失敗
      for (let i = 0; i < 4; i++) {
        const response = await request(app)
          .post('/api/admin/login')
          .send({
            username: 'testadmin',
            password: 'wrongpassword',
          });

        expect(response.status).toBe(401);
        expect(response.body.remainingAttempts).toBe(5 - (i + 1));
      }

      // 第 5 次失敗，應該被鎖定
      const fifthResponse = await request(app)
        .post('/api/admin/login')
        .send({
          username: 'testadmin',
          password: 'wrongpassword',
        });

      expect(fifthResponse.status).toBe(423);
      expect(fifthResponse.body.message).toContain('帳號已被鎖定');
      expect(fifthResponse.body.message).toContain('15 分鐘');

      // 驗證帳號已被鎖定
      const lockedAdmin = await Admin.findOne({ username: 'testadmin' });
      expect(lockedAdmin?.loginAttempts).toBe(5);
      expect(lockedAdmin?.lockUntil).toBeDefined();
      expect(lockedAdmin?.lockUntil!.getTime()).toBeGreaterThan(Date.now());
    });

    test('已鎖定的帳號應該拒絕登入（即使密碼正確）', async () => {
      // 建立已鎖定的帳號
      const admin = new Admin({
        username: 'testadmin',
        password: 'correctpassword',
        isActive: true,
        loginAttempts: 5,
        lockUntil: new Date(Date.now() + 10 * 60 * 1000), // 鎖定 10 分鐘
      });
      await admin.save();

      const response = await request(app)
        .post('/api/admin/login')
        .send({
          username: 'testadmin',
          password: 'correctpassword', // 密碼正確
        });

      expect(response.status).toBe(423);
      expect(response.body.message).toContain('帳號已被鎖定');
      expect(response.body.message).toMatch(/\d+ 分鐘/); // 包含剩餘時間
    });

    test('鎖定時間過期後應該可以正常登入', async () => {
      // 建立鎖定已過期的帳號
      const admin = new Admin({
        username: 'testadmin',
        password: 'correctpassword',
        isActive: true,
        loginAttempts: 5,
        lockUntil: new Date(Date.now() - 1000), // 1 秒前過期
      });
      await admin.save();

      const response = await request(app)
        .post('/api/admin/login')
        .send({
          username: 'testadmin',
          password: 'correctpassword',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('token');

      // 驗證鎖定狀態已清除
      const updatedAdmin = await Admin.findOne({ username: 'testadmin' });
      expect(updatedAdmin?.loginAttempts).toBe(0);
      expect(updatedAdmin?.lockUntil).toBeUndefined();
    });
  });

  describe('邊緣情況', () => {
    test('空字串 username 應該返回 400', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          username: '',
          password: 'password123',
        });

      expect(response.status).toBe(400);
    });

    test('空字串 password 應該返回 400', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          username: 'testadmin',
          password: '',
        });

      expect(response.status).toBe(400);
    });

    test('超長 username 應該正確處理', async () => {
      const longUsername = 'a'.repeat(1000);
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          username: longUsername,
          password: 'password123',
        });

      // 應該返回 401（帳號不存在），而不是伺服器錯誤
      expect(response.status).toBe(401);
    });
  });
});
