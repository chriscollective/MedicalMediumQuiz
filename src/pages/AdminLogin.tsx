import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { NatureAccents } from '../components/NatureAccents';
import { Lock, User } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (username: string) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app, validate credentials
    if (username && password) {
      onLogin(username);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF7] to-[#A8CBB7]/10 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Nature Accents */}
      <NatureAccents variant="minimal" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-[#A8CBB7]/30">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#A8CBB7] to-[#9fb8a8] rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-[#2d3436]">管理員登入</h2>
            <p className="text-[#636e72] text-sm mt-2">醫療靈媒隨堂測驗後台</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#2d3436]">帳號</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#636e72]" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 border-[#A8CBB7]/30 focus:border-[#A8CBB7] focus:ring-[#A8CBB7]"
                  placeholder="請輸入帳號"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#2d3436]">密碼</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#636e72]" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-[#A8CBB7]/30 focus:border-[#A8CBB7] focus:ring-[#A8CBB7]"
                  placeholder="請輸入密碼"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="
                w-full
                bg-gradient-to-r from-[#A8CBB7] to-[#9fb8a8]
                text-white py-6 rounded-xl
                hover:shadow-lg hover:shadow-[#A8CBB7]/30
                transition-all duration-300
                relative overflow-hidden
                group
              "
            >
              <span className="relative z-10">登入</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
