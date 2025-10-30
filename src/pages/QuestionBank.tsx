import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { NatureAccents } from '../components/NatureAccents';
import { ArrowLeft, Plus, Pencil, Trash2, Search } from 'lucide-react';

interface QuestionBankProps {
  onBack: () => void;
}

interface QuestionData {
  id: string;
  question: string;
  type: '單選' | '多選' | '填空';
  book: string;
  difficulty: '初階' | '進階';
  accuracy: number;
}

const mockQuestions: QuestionData[] = [
  { id: 'Q001', question: '哪種水果最能幫助肝臟排毒？', type: '單選', book: '搶救肝臟', difficulty: '初階', accuracy: 94 },
  { id: 'Q002', question: '以下哪些是重金屬排毒五大天王？', type: '多選', book: '改變生命的食物', difficulty: '進階', accuracy: 78 },
  { id: 'Q003', question: '肝臟最需要的營養素是______。', type: '填空', book: '搶救肝臟', difficulty: '初階', accuracy: 85 },
  { id: 'Q004', question: '以下哪個不是安東尼建議的晨間淨化飲品？', type: '單選', book: '神奇西芹汁', difficulty: '初階', accuracy: 91 },
  { id: 'Q005', question: '野生藍莓對大腦的主要療癒作用是？', type: '單選', book: '改變生命的食物', difficulty: '進階', accuracy: 67 }
];

export function QuestionBank({ onBack }: QuestionBankProps) {
  const [questions, setQuestions] = useState<QuestionData[]>(mockQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBook, setFilterBook] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null);
  
  const [formData, setFormData] = useState({
    book: '',
    chapter: '',
    difficulty: '初階',
    type: '單選',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    page: ''
  });
  
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBook = filterBook === 'all' || q.book === filterBook;
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    return matchesSearch && matchesBook && matchesDifficulty;
  });
  
  const handleDelete = (id: string) => {
    if (confirm('確定要刪除此題目嗎？')) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };
  
  const handleEdit = (question: QuestionData) => {
    setEditingQuestion(question);
    setIsDialogOpen(true);
  };
  
  const handleSave = () => {
    // Mock save functionality
    setIsDialogOpen(false);
    setEditingQuestion(null);
    setFormData({
      book: '',
      chapter: '',
      difficulty: '初階',
      type: '單選',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      page: ''
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF7] to-[#F7E6C3]/20 relative overflow-hidden">
      {/* Nature Accents */}
      <NatureAccents variant="minimal" />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-[#A8CBB7]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="ghost"
                className="text-[#A8CBB7] hover:bg-[#F7E6C3]/20"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回
              </Button>
              <h2 className="text-[#2d3436]">題庫管理</h2>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#A8CBB7] to-[#9fb8a8] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  新增題目
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingQuestion ? '編輯題目' : '新增題目'}</DialogTitle>
                  <DialogDescription>
                    填寫題目相關資訊，完成後點擊儲存
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>書籍</Label>
                      <Select value={formData.book} onValueChange={(v) => setFormData({...formData, book: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇書籍" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="celery">神奇西芹汁</SelectItem>
                          <SelectItem value="liver">搶救肝臟</SelectItem>
                          <SelectItem value="food">改變生命的食物</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>章節</Label>
                      <Input 
                        placeholder="例如：第3章" 
                        value={formData.chapter}
                        onChange={(e) => setFormData({...formData, chapter: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>難度</Label>
                      <RadioGroup value={formData.difficulty} onValueChange={(v) => setFormData({...formData, difficulty: v})}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="初階" id="beginner" />
                          <Label htmlFor="beginner">初階</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="進階" id="advanced" />
                          <Label htmlFor="advanced">進階</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>題型</Label>
                      <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="單選">單選題</SelectItem>
                          <SelectItem value="多選">多選題</SelectItem>
                          <SelectItem value="填空">填空題</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>題目內容</Label>
                    <Textarea 
                      placeholder="輸入題目..." 
                      value={formData.question}
                      onChange={(e) => setFormData({...formData, question: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  {(formData.type === '單選' || formData.type === '多選') && (
                    <div className="space-y-2">
                      <Label>選項</Label>
                      {formData.options.map((opt, idx) => (
                        <Input
                          key={idx}
                          placeholder={`選項 ${idx + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[idx] = e.target.value;
                            setFormData({...formData, options: newOptions});
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label>正確答案</Label>
                    <Input 
                      placeholder="輸入正確答案" 
                      value={formData.correctAnswer}
                      onChange={(e) => setFormData({...formData, correctAnswer: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>解析</Label>
                    <Textarea 
                      placeholder="解釋為什麼這是正確答案..." 
                      value={formData.explanation}
                      onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>頁碼</Label>
                    <Input 
                      placeholder="例如：p.52" 
                      value={formData.page}
                      onChange={(e) => setFormData({...formData, page: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="border-[#A8CBB7]"
                    >
                      取消
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-[#A8CBB7] to-[#9fb8a8] text-white"
                    >
                      儲存
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-[#A8CBB7]/20">
            <CardHeader>
              <CardTitle className="text-[#2d3436]">題目列表</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#636e72]" />
                  <Input
                    placeholder="搜尋題目..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterBook} onValueChange={setFilterBook}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="選擇書籍" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部書籍</SelectItem>
                    <SelectItem value="神奇西芹汁">神奇西芹汁</SelectItem>
                    <SelectItem value="搶救肝臟">搶救肝臟</SelectItem>
                    <SelectItem value="改變生命的食物">改變生命的食物</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="難度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部難度</SelectItem>
                    <SelectItem value="初階">初階</SelectItem>
                    <SelectItem value="進階">進階</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Table */}
              <div className="rounded-lg border border-[#A8CBB7]/20 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F7E6C3]/20 border-[#A8CBB7]/20">
                      <TableHead>題號</TableHead>
                      <TableHead>題目內容</TableHead>
                      <TableHead>題型</TableHead>
                      <TableHead>書籍</TableHead>
                      <TableHead>難度</TableHead>
                      <TableHead>答對率</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.map((q) => (
                      <TableRow key={q.id} className="border-[#A8CBB7]/20">
                        <TableCell>{q.id}</TableCell>
                        <TableCell className="max-w-md">{q.question}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-[#A8CBB7]/20 rounded text-sm">
                            {q.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-[#F7E6C3]/50 rounded text-sm">
                            {q.book}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`
                            px-2 py-1 rounded text-sm
                            ${q.difficulty === '初階' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
                          `}>
                            {q.difficulty}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`
                            px-2 py-1 rounded text-sm
                            ${q.accuracy < 60 ? 'bg-red-100 text-red-700' : 
                              q.accuracy < 80 ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-green-100 text-green-700'}
                          `}>
                            {q.accuracy}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(q)}
                              className="text-[#A8CBB7] hover:bg-[#F7E6C3]/20"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(q.id)}
                              className="text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="text-sm text-[#636e72] text-center pt-4">
                共 {filteredQuestions.length} 筆題目
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
