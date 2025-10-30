import React from 'react';
import { Progress } from './ui/progress';

interface QuizProgressProps {
  currentPage: number;
  totalPages: number;
}

export function QuizProgress({ currentPage, totalPages }: QuizProgressProps) {
  const progress = (currentPage / totalPages) * 100;
  
  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-[#636e72]">第 {currentPage} / {totalPages} 頁</span>
        <span className="text-sm text-[#636e72]">{Math.round(progress)}%</span>
      </div>
      <div className="relative h-2 bg-[#e8ebe9] rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#A8CBB7] via-[#9fb8a8] to-[#E5C17A] transition-all duration-500 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
