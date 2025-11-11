import React from "react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { NaturalPattern } from "../components/NaturalPattern";
import { NatureDecoration } from "../components/NatureDecoration";
import { FloatingHerbs } from "../components/FloatingHerbs";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useIsMobile } from "../utils/useIsMobile";

interface CorrectionNoticeProps {
  onBack: () => void;
}

export function CorrectionNotice({ onBack }: CorrectionNoticeProps) {
  const { isMobile } = useIsMobile();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#FAFAF7] via-[#F7E6C3]/20 to-[#A8CBB7]/10">
      {/* 背景（沿用首頁） */}
      <div
        className={`absolute inset-0 opacity-30 ${isMobile ? "hidden" : ""}`}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1604248215430-100912b27ead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwbmF0dXJlJTIwbGVhdmVzJTIwbGlnaHR8ZW58MXx8fHwxNzYxODA3MjI2fDA&ixlib=rb-4.1.0&q=80&w=1080')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(60px)",
        }}
      />

      {/* 裝飾元素 */}
      <NaturalPattern />
      {!isMobile && <NatureDecoration />}
      {!isMobile && <FloatingHerbs />}

      {/* 透明頂部列（置中標題，右側返回） */}
      <div className="relative z-10 bg-transparent pt-10">
        <div className="container mx-auto px-4 py-16 relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 text-[#2d3436]">
              <Sparkles className="w-6 h-6 text-[#A8CBB7]" />
              <span className="text-2xl font-extrabold">修正公告</span>
              <Sparkles className="w-6 h-6 text-[#A8CBB7]" />
            </div>
          </div>
          <div className="flex items-center justify-end"></div>
        </div>
      </div>

      {/* 內容區塊（與頂部列拉開距離） */}
      <div className="relative z-10 container mx-auto px-4 pt-28 pb-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 20 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <Card className="border-[#A8CBB7]/20 mt-8">
            <CardHeader>
              <CardTitle className="text-[#2d3436]">【修正公告】</CardTitle>
              <CardDescription className="text-[#636e72]">
                此區塊為本站題目內容的修正公告
              </CardDescription>
            </CardHeader>
            <CardContent className="text-[#2d3436] space-y-4">
              <div className="space-y-3">
                <p className="font-semibold text-[#A8CBB7]">
                  【神奇西芹汁】複選題
                </p>
                <p className="leading-relaxed">
                  <strong>題目：</strong>以下哪些敘述正確說明了西芹汁如何幫助療癒泌尿道感染、膀胱炎與酵母菌感染？
                </p>
                <ul className="list-none space-y-2 pl-4">
                  <li>a: 泌尿道感染、細菌性陰道炎與酵母菌感染都與鏈球菌有關</li>
                  <li>b: 西芹汁的鈉簇鹽能附著在鏈球菌上並經由尿液排出體外</li>
                  <li>c: 酵母菌是造成泌尿道感染的主要元兇，西芹汁能直接抑制其繁殖</li>
                  <li>d: 西芹汁能經由淋巴系統進入生殖系統，協助清除深層感染</li>
                </ul>
                <p className="mt-4 text-red-600 font-semibold">
                  <strong>修正：</strong>答案應為 <span className="underline">a、b、d</span>（原本錯誤標記為 b、d）
                </p>
                <p className="text-[#636e72] leading-relaxed bg-[#F7E6C3]/20 p-3 rounded-lg">
                  <strong>解析：</strong>這些感染的真正原因是鏈球菌（A），而非酵母菌。西芹汁的鈉簇鹽能附著並排出鏈球菌（B），同時經由淋巴系統深入生殖系統協助清除感染（D）。
                </p>
              </div>
            </CardContent>
          </Card>

          <div
            className="flex justify-center pt-2"
            style={{ marginBottom: "80px" }}
          >
            <Button
              onClick={onBack}
              className="px-8 py-6 cursor-pointer rounded-2xl bg-gradient-to-r from-[#A8CBB7] to-[#9fb8a8] text-white shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> 返回首頁
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
