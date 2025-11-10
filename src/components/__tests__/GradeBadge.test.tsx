/**
 * GradeBadge 組件測試
 * 測試等級徽章的渲染和不同等級的視覺樣式
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { GradeBadge } from '../GradeBadge';

// Mock Framer Motion to avoid animation issues in tests
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, style, className, ...props }: any) => (
      <div style={style} className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Sparkles: ({ className }: { className?: string }) => (
    <span data-testid="sparkle-icon" className={className}>✨</span>
  ),
}));

describe('GradeBadge', () => {
  describe('等級文字渲染', () => {
    test('應該正確渲染 S 等級', () => {
      render(<GradeBadge grade="S" />);
      expect(screen.getByText('S')).toBeInTheDocument();
    });

    test('應該正確渲染 A+ 等級', () => {
      render(<GradeBadge grade="A+" />);
      expect(screen.getByText('A+')).toBeInTheDocument();
    });

    test('應該正確渲染 A 等級', () => {
      render(<GradeBadge grade="A" />);
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    test('應該正確渲染 B+ 等級', () => {
      render(<GradeBadge grade="B+" />);
      expect(screen.getByText('B+')).toBeInTheDocument();
    });

    test('應該正確渲染 B 等級', () => {
      render(<GradeBadge grade="B" />);
      expect(screen.getByText('B')).toBeInTheDocument();
    });

    test('應該正確渲染 C+ 等級', () => {
      render(<GradeBadge grade="C+" />);
      expect(screen.getByText('C+')).toBeInTheDocument();
    });

    test('應該正確渲染 F 等級', () => {
      render(<GradeBadge grade="F" />);
      expect(screen.getByText('F')).toBeInTheDocument();
    });
  });

  describe('Sparkles 動畫裝飾', () => {
    test('S 等級應該顯示 3 個 Sparkles 圖標', () => {
      render(<GradeBadge grade="S" />);
      const sparkles = screen.getAllByTestId('sparkle-icon');
      expect(sparkles).toHaveLength(3);
    });

    test('A+ 等級應該顯示 3 個 Sparkles 圖標', () => {
      render(<GradeBadge grade="A+" />);
      const sparkles = screen.getAllByTestId('sparkle-icon');
      expect(sparkles).toHaveLength(3);
    });

    test('A 等級不應該顯示 Sparkles 圖標', () => {
      render(<GradeBadge grade="A" />);
      const sparkles = screen.queryAllByTestId('sparkle-icon');
      expect(sparkles).toHaveLength(0);
    });

    test('B+ 等級不應該顯示 Sparkles 圖標', () => {
      render(<GradeBadge grade="B+" />);
      const sparkles = screen.queryAllByTestId('sparkle-icon');
      expect(sparkles).toHaveLength(0);
    });

    test('B 等級不應該顯示 Sparkles 圖標', () => {
      render(<GradeBadge grade="B" />);
      const sparkles = screen.queryAllByTestId('sparkle-icon');
      expect(sparkles).toHaveLength(0);
    });

    test('C+ 等級不應該顯示 Sparkles 圖標', () => {
      render(<GradeBadge grade="C+" />);
      const sparkles = screen.queryAllByTestId('sparkle-icon');
      expect(sparkles).toHaveLength(0);
    });

    test('F 等級不應該顯示 Sparkles 圖標', () => {
      render(<GradeBadge grade="F" />);
      const sparkles = screen.queryAllByTestId('sparkle-icon');
      expect(sparkles).toHaveLength(0);
    });
  });

  describe('視覺樣式', () => {
    test('S 等級應該有金色漸變背景', () => {
      const { container } = render(<GradeBadge grade="S" />);
      const badge = container.querySelector('div[style*="linear-gradient"]');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveStyle({
        backgroundImage: 'linear-gradient(to bottom right, #E5C17A, #f4d89e, #E5C17A)',
      });
    });

    test('A+ 等級應該有淺奶油色漸變背景', () => {
      const { container } = render(<GradeBadge grade="A+" />);
      const badge = container.querySelector('div[style*="linear-gradient"]');
      expect(badge).toHaveStyle({
        backgroundImage: 'linear-gradient(to bottom right, #F7E6C3, #e8d9b5)',
      });
    });

    test('B+ 等級應該有綠色漸變背景', () => {
      const { container } = render(<GradeBadge grade="B+" />);
      const badge = container.querySelector('div[style*="linear-gradient"]');
      expect(badge).toHaveStyle({
        backgroundImage: 'linear-gradient(to bottom right, #A8CBB7, #c5dccf, #A8CBB7)',
      });
    });

    test('F 等級應該有灰色漸變背景', () => {
      const { container } = render(<GradeBadge grade="F" />);
      const badge = container.querySelector('div[style*="linear-gradient"]');
      expect(badge).toHaveStyle({
        backgroundImage: 'linear-gradient(to bottom right, #d1d5db, #9ca3af)',
      });
    });

    test('徽章應該是圓形（borderRadius: 9999px）', () => {
      const { container } = render(<GradeBadge grade="A" />);
      const badge = container.querySelector('div[style*="border-radius"]');
      expect(badge).toHaveStyle({
        borderRadius: '9999px',
      });
    });

    test('等級文字應該是白色', () => {
      render(<GradeBadge grade="S" />);
      const gradeText = screen.getByText('S');
      // CSS 會將 'white' 轉換為 'rgb(255, 255, 255)'
      expect(gradeText).toHaveStyle({
        color: 'rgb(255, 255, 255)',
      });
    });
  });

  describe('響應式設計', () => {
    // 備註：這些測試驗證組件結構，實際大小由 useEffect 中的 window.innerWidth 控制
    // 在真實環境中會根據視窗大小調整

    test('應該渲染包含大小樣式的徽章', () => {
      const { container } = render(<GradeBadge grade="A" />);
      const badge = container.querySelector('div[style*="width"]');
      expect(badge).toBeInTheDocument();
      // 預設是桌面尺寸（10rem）
      expect(badge).toHaveStyle({
        width: '10rem',
        height: '10rem',
      });
    });

    test('應該設定 display: flex 進行居中對齊', () => {
      const { container } = render(<GradeBadge grade="B" />);
      const badge = container.querySelector('div[style*="display"]');
      expect(badge).toHaveStyle({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      });
    });
  });

  describe('結構完整性', () => {
    test('應該包含兩層 div（外層容器 + 徽章本體）', () => {
      const { container } = render(<GradeBadge grade="A" />);
      const divs = container.querySelectorAll('div');
      // 至少包含：外層容器、徽章本體、內部光澤層
      expect(divs.length).toBeGreaterThanOrEqual(3);
    });

    test('應該包含內部光澤層效果', () => {
      const { container } = render(<GradeBadge grade="S" />);
      const glossLayer = container.querySelector('div[style*="rgba(255, 255, 255, 0.2)"]');
      expect(glossLayer).toBeInTheDocument();
    });

    test('等級文字應該有相對定位和 z-index', () => {
      render(<GradeBadge grade="A+" />);
      const gradeText = screen.getByText('A+');
      expect(gradeText).toHaveStyle({
        position: 'relative',
        zIndex: '10',
      });
    });
  });
});
