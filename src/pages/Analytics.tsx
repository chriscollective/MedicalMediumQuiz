import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { NatureAccents } from '../components/NatureAccents';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeft, Users, Award, TrendingUp, BookOpen } from 'lucide-react';

interface AnalyticsProps {
  onBack: () => void;
}

// Mock data
const gradeDistribution = [
  { name: 'S', value: 15, fill: '#E5C17A' },
  { name: 'A+', value: 28, fill: '#A8CBB7' },
  { name: 'A', value: 35, fill: '#9fb8a8' },
  { name: 'B+', value: 42, fill: '#F7E6C3' },
  { name: 'B', value: 25, fill: '#d9dcd9' },
  { name: 'C+', value: 18, fill: '#b0b0b0' },
  { name: 'F', value: 7, fill: '#8a8a8a' }
];

const bookParticipation = [
  { name: '神奇西芹汁', value: 542, fill: '#A8CBB7' },
  { name: '搶救肝臟', value: 438, fill: '#E5C17A' },
  { name: '改變生命的食物', value: 321, fill: '#F7E6C3' }
];

const questionAccuracy = [
  { question: 'Q1', accuracy: 94 },
  { question: 'Q2', accuracy: 78 },
  { question: 'Q3', accuracy: 85 },
  { question: 'Q4', accuracy: 91 },
  { question: 'Q5', accuracy: 67 },
  { question: 'Q6', accuracy: 72 },
  { question: 'Q7', accuracy: 88 },
  { question: 'Q8', accuracy: 56 },
  { question: 'Q9', accuracy: 81 },
  { question: 'Q10', accuracy: 73 }
];

const wrongQuestions = [
  { id: 'Q008', question: '每天應該喝多少毫升的芹菜汁？', book: '神奇西芹汁', accuracy: 56, attempts: 182 },
  { id: 'Q005', question: '野生藍莓對大腦的主要療癒作用是？', book: '改變生命的食物', accuracy: 67, attempts: 165 },
  { id: 'Q010', question: '香菜能夠幫助身體排出______。', book: '改變生命的食物', accuracy: 72, attempts: 158 },
  { id: 'Q006', question: 'EB病毒的主要食物是______。', book: '搶救肝臟', accuracy: 73, attempts: 149 }
];

export function Analytics({ onBack }: AnalyticsProps) {
  const [selectedBook, setSelectedBook] = useState<string>('all');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF7] to-[#F7E6C3]/20 relative overflow-hidden">
      {/* Nature Accents */}
      <NatureAccents variant="minimal" />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-[#A8CBB7]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-[#A8CBB7] hover:bg-[#F7E6C3]/20"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回
            </Button>
            <h2 className="text-[#2d3436]">數據分析</h2>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Users, title: '累積測驗人數', value: '1,247', color: 'from-[#A8CBB7] to-[#9fb8a8]' },
            { icon: Award, title: '平均等級', value: 'B+', color: 'from-[#E5C17A] to-[#d4b86a]' },
            { icon: TrendingUp, title: '平均答對率', value: '76.8%', color: 'from-[#F7E6C3] to-[#e8d9b5]' },
            { icon: BookOpen, title: '最熱門書籍', value: '神奇西芹汁', color: 'from-[#A8CBB7] to-[#9fb8a8]' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-[#A8CBB7]/20 overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#636e72] mb-1">{stat.title}</p>
                      <p className="text-[#2d3436]" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Filters */}
        <Card className="border-[#A8CBB7]/20">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <span className="text-sm text-[#636e72]">篩選條件：</span>
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="選擇書籍" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部書籍</SelectItem>
                  <SelectItem value="celery">神奇西芹汁</SelectItem>
                  <SelectItem value="liver">搶救肝臟</SelectItem>
                  <SelectItem value="food">改變生命的食物</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Grade Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-[#A8CBB7]/20">
              <CardHeader>
                <CardTitle className="text-[#2d3436]">等級分布</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#A8CBB7" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#636e72" />
                    <YAxis stroke="#636e72" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #A8CBB7',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Book Participation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-[#A8CBB7]/20">
              <CardHeader>
                <CardTitle className="text-[#2d3436]">書籍參與比例</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bookParticipation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {bookParticipation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff',
                        border: '1px solid #A8CBB7',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Question Accuracy Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-[#A8CBB7]/20">
            <CardHeader>
              <CardTitle className="text-[#2d3436]">題目答對率走勢</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={questionAccuracy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#A8CBB7" opacity={0.2} />
                  <XAxis dataKey="question" stroke="#636e72" />
                  <YAxis stroke="#636e72" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #A8CBB7',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#A8CBB7" 
                    strokeWidth={3}
                    dot={{ fill: '#E5C17A', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Wrong Questions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="border-[#A8CBB7]/20">
            <CardHeader>
              <CardTitle className="text-[#2d3436]">錯題排行榜</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#A8CBB7]/20">
                    <TableHead>題號</TableHead>
                    <TableHead>題目</TableHead>
                    <TableHead>書籍</TableHead>
                    <TableHead>答對率</TableHead>
                    <TableHead>作答次數</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wrongQuestions.map((q) => (
                    <TableRow key={q.id} className="border-[#A8CBB7]/20">
                      <TableCell>{q.id}</TableCell>
                      <TableCell className="max-w-md">{q.question}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-[#F7E6C3]/50 rounded text-sm">
                          {q.book}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`
                          px-2 py-1 rounded text-sm
                          ${q.accuracy < 60 ? 'bg-red-100 text-red-700' : 
                            q.accuracy < 75 ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-green-100 text-green-700'}
                        `}>
                          {q.accuracy}%
                        </span>
                      </TableCell>
                      <TableCell>{q.attempts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
