import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface Book {
  _id: string;
  name: string;
  createdAt: string;
}

/**
 * 新增書籍
 */
export async function createBook(name: string, token: string): Promise<Book> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/books`,
      { name },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data.book;
  } catch (error: any) {
    if (error.response) {
      // 伺服器回應錯誤
      throw new Error(error.response.data.message || '新增書籍失敗');
    } else if (error.request) {
      // 請求已發送但沒有收到回應
      throw new Error('無法連接到伺服器');
    } else {
      // 其他錯誤
      throw new Error('發生未知錯誤');
    }
  }
}

/**
 * 取得所有書籍列表
 */
export async function fetchBooks(): Promise<Book[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/books`);
    return response.data.books;
  } catch (error: any) {
    console.error('取得書籍列表失敗:', error);
    if (error.response) {
      throw new Error(error.response.data.message || '取得書籍列表失敗');
    } else if (error.request) {
      throw new Error('無法連接到伺服器');
    } else {
      throw new Error('發生未知錯誤');
    }
  }
}
