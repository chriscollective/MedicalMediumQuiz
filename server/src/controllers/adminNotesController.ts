import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Admin from '../models/Admin';

// 取得基本管理員資訊（僅 username 與 note）
export const getAdminsBasic = async (req: AuthRequest, res: Response) => {
  try {
    const admins = await Admin.find({}, { _id: 0, username: 1, note: 1 }).lean();
    return res.json({ success: true, data: admins });
  } catch (error) {
    return res.status(500).json({ success: false, message: '取得管理員名單失敗' });
  }
};

// 更新自己筆記（僅本人可改）
export const updateMyNote = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.admin?.id;
    if (!adminId) {
      return res.status(401).json({ success: false, message: '未授權' });
    }

    const { note } = (req.body || {}) as { note?: string };
    if (typeof note !== 'string') {
      return res.status(400).json({ success: false, message: 'note 需為字串' });
    }

    const trimmed = note.trim();
    if (trimmed.length > 1000) {
      return res.status(400).json({ success: false, message: 'note 長度不可超過 1000' });
    }

    await Admin.findByIdAndUpdate(adminId, { note: trimmed });
    return res.json({ success: true, message: '已更新筆記' });
  } catch (error) {
    return res.status(500).json({ success: false, message: '更新筆記失敗' });
  }
};

