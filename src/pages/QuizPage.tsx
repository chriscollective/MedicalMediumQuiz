import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuestionCard, Question } from '../components/QuestionCard';
import { QuizProgress } from '../components/QuizProgress';
import { Button } from '../components/ui/button';
import { NatureAccents } from '../components/NatureAccents';
import { ChevronLeft, ChevronRight, Home, Pause, Sparkles } from 'lucide-react';

interface QuizPageProps {
  books: string[];
  difficulty: string;
  onComplete: (answers: Record<string, string | string[]>) => void;
  onBack: () => void;
}

// Mock questions - 20 questions total (4 pages x 5 questions)
const generateMockQuestions = (): Question[] => {
  return [
    // Page 1
    {
      id: '1',
      type: 'single',
      question: '哪種食物能幫助修復神經系統？',
      options: ['維生素C', '芹菜汁', '咖啡', '糖'],
      correctAnswer: '芹菜汁',
      source: '《神奇西芹汁》第3章 p.52',
      explanation: '芹菜汁能清除神經系統中重金屬沉積。'
    },
    {
      id: '2',
      type: 'multiple',
      question: '以下哪些是重金屬排毒五大天王？（可複選）',
      options: ['野生藍莓', '香菜', '螺旋藻', '大蒜', '大麥草汁粉'],
      correctAnswer: ['野生藍莓', '香菜', '螺旋藻', '大蒜', '大麥草汁粉'],
      source: '《改變生命的食物》第5章',
      explanation: '這五種食物協同作用，能有效排除體內重金屬。'
    },
    {
      id: '3',
      type: 'fill',
      question: '肝臟最需要的營養素是______。',
      fillOptions: ['葡萄糖', '蛋白質', '脂肪', '纖維'],
      correctAnswer: '葡萄糖',
      source: '《搶救肝臟》第2章',
      explanation: '肝臟需要生物可利用的葡萄糖來執行超過2000種化學功能。'
    },
    {
      id: '4',
      type: 'single',
      question: '以下哪個不是安東尼建議的晨間淨化飲品？',
      options: ['檸檬水', '芹菜汁', '咖啡', '小黃瓜汁'],
      correctAnswer: '咖啡',
      source: '《神奇西芹汁》第1章'
    },
    {
      id: '5',
      type: 'single',
      question: '野生藍莓對大腦的主要療癒作用是？',
      options: ['提供能量', '修復神經元', '增加記憶力', '促進睡眠'],
      correctAnswer: '修復神經元',
      source: '《改變生命的食物》p.78'
    },
    // Page 2
    {
      id: '6',
      type: 'fill',
      question: 'EB病毒（Epstein-Barr）的主要食物是______。',
      fillOptions: ['糖分', '蛋', '重金屬', '毒素'],
      correctAnswer: '重金屬',
      source: '《搶救肝臟》第4章'
    },
    {
      id: '7',
      type: 'multiple',
      question: '以下哪些食物是安東尼建議避免的？（可複選）',
      options: ['蛋', '牛奶', '麩質', '玉米', '水果'],
      correctAnswer: ['蛋', '牛奶', '麩質', '玉米'],
      source: '《改變生命的食物》'
    },
    {
      id: '8',
      type: 'single',
      question: '每天應該喝多少毫升的芹菜汁？',
      options: ['250ml', '500ml', '750ml', '1000ml'],
      correctAnswer: '500ml',
      source: '《神奇西芹汁》'
    },
    {
      id: '9',
      type: 'single',
      question: '肝臟排毒最佳的時間是？',
      options: ['早上', '中午', '傍晚', '深夜'],
      correctAnswer: '深夜',
      source: '《搶救肝臟》第3章'
    },
    {
      id: '10',
      type: 'fill',
      question: '香菜能夠幫助身體排出______。',
      fillOptions: ['重金屬', '病毒', '細菌', '寄生蟲'],
      correctAnswer: '重金屬',
      source: '《改變生命的食物》'
    },
    // Page 3
    {
      id: '11',
      type: 'single',
      question: '以下哪種水果對肝臟最有益？',
      options: ['蘋果', '香蕉', '木瓜', '櫻桃'],
      correctAnswer: '木瓜',
      source: '《搶救肝臟》'
    },
    {
      id: '12',
      type: 'multiple',
      question: '安東尼推薦的早晨淨化順序是？',
      options: ['檸檬水', '芹菜汁', '重金屬排毒果昔', '早餐'],
      correctAnswer: ['檸檬水', '芹菜汁', '重金屬排毒果昔'],
      source: '《神奇西芹汁》'
    },
    {
      id: '13',
      type: 'single',
      question: '芹菜汁應該如何飲用才能發揮最大功效？',
      options: ['餐後喝', '空腹喝', '加冰塊喝', '加蜂蜜喝'],
      correctAnswer: '空腹喝',
      source: '《神奇西芹汁》第2章'
    },
    {
      id: '14',
      type: 'fill',
      question: '帶狀皰疹是由______病毒引起的。',
      fillOptions: ['EB病毒', '帶狀皰疹病毒', '流感病毒', 'HPV病毒'],
      correctAnswer: '帶狀皰疹病毒',
      source: '《搶救肝臟》'
    },
    {
      id: '15',
      type: 'single',
      question: '以下哪個不是肝臟的主要功能？',
      options: ['排毒', '儲存營養', '製造消化酶', '過濾血液'],
      correctAnswer: '製造消化酶',
      source: '《搶救肝臟》第1章'
    },
    // Page 4
    {
      id: '16',
      type: 'multiple',
      question: '靈性高湯的主要食材包括？',
      options: ['洋蔥', '番茄', '芹菜', '大蒜', '香菜'],
      correctAnswer: ['洋蔥', '番茄', '芹菜', '大蒜'],
      source: '《改變生命的食物》'
    },
    {
      id: '17',
      type: 'single',
      question: '鋅對免疫系統的作用是？',
      options: ['增強免疫力', '排毒', '抗發炎', '修復組織'],
      correctAnswer: '增強免疫力',
      source: '《改變生命的食物》'
    },
    {
      id: '18',
      type: 'fill',
      question: '______是最強大的抗病毒食物之一。',
      fillOptions: ['大蒜', '薑', '蜂蜜', '檸檬'],
      correctAnswer: '大蒜',
      source: '《改變生命的食物》'
    },
    {
      id: '19',
      type: 'single',
      question: '369排毒法的天數是？',
      options: ['3天', '6天', '9天', '12天'],
      correctAnswer: '9天',
      source: '《搶救肝臟》'
    },
    {
      id: '20',
      type: 'multiple',
      question: '以下哪些是神經系統的食物？',
      options: ['芹菜汁', '野生藍莓', '菠菜', '香蕉'],
      correctAnswer: ['芹菜汁', '野生藍莓', '菠菜', '香蕉'],
      source: '《神奇西芹汁》'
    }
  ];
};

export function QuizPage({ books, difficulty, onComplete, onBack }: QuizPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  
  const questions = generateMockQuestions();
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  
  const currentQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );
  
  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      setDirection('forward');
      setCurrentPage(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      setDirection('backward');
      setCurrentPage(prev => prev - 1);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF7] to-[#F7E6C3]/30 relative overflow-hidden">
      {/* Nature Accents */}
      <NatureAccents variant="minimal" />
      
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-[#A8CBB7]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#A8CBB7]" />
              <span className="text-[#2d3436]">醫療靈媒測驗</span>
            </div>
            
            <div className="flex-1 max-w-md mx-8">
              <QuizProgress currentPage={currentPage} totalPages={totalPages} />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-[#636e72] hover:text-[#A8CBB7] hover:bg-[#F7E6C3]/20"
              >
                <Pause className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-[#636e72] hover:text-[#A8CBB7] hover:bg-[#F7E6C3]/20"
              >
                <Home className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Questions */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            initial={{ opacity: 0, x: direction === 'forward' ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 'forward' ? -100 : 100 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            {currentQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <QuestionCard
                  question={question}
                  index={(currentPage - 1) * questionsPerPage + index}
                  userAnswer={answers[question.id]}
                  onAnswerChange={(answer) => handleAnswerChange(question.id, answer)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Buttons */}
        <div className="fixed bottom-8 right-8 flex gap-3">
          <Button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            variant="outline"
            className="
              rounded-full w-12 h-12 p-0
              border-[#A8CBB7] text-[#A8CBB7]
              hover:bg-[#A8CBB7] hover:text-white
              disabled:opacity-30 disabled:cursor-not-allowed
              shadow-lg hover:shadow-xl
              transition-all duration-300
            "
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={handleNext}
            className="
              rounded-full px-6 h-12
              bg-gradient-to-r from-[#A8CBB7] to-[#9fb8a8]
              text-white shadow-lg hover:shadow-xl
              transition-all duration-300
              flex items-center gap-2
            "
          >
            {currentPage === totalPages ? '完成' : '下一頁'}
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Page Indicator */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <span className="text-sm text-[#636e72]">
              第 {currentPage} / {totalPages} 頁
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
