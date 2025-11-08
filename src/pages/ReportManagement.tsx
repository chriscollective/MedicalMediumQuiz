import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { NatureAccents } from "../components/NatureAccents";
import {
  ArrowLeft,
  CheckSquare,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  getAllReports,
  updateReportStatus,
  deleteReport,
} from "../services/reportService";

interface ReportManagementProps {
  onBack: () => void;
}

interface Report {
  _id: string;
  bookName: string;
  questionType: string;
  questionContent: string;
  issueDescription: string;
  status: "pending" | "in_progress" | "resolved" | "dismissed";
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
}

export function ReportManagement({ onBack }: ReportManagementProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await getAllReports({ limit: 100 });
      setReports(data.reports);
    } catch (error) {
      console.error("載入回報失敗:", error);
      alert("載入失敗，請重新整理頁面");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleResolved = async (report: Report) => {
    try {
      const newStatus = report.status === "resolved" ? "pending" : "resolved";
      await updateReportStatus(report._id, {
        status: newStatus,
        resolvedBy: "admin",
      });

      // 更新本地狀態
      setReports(
        reports.map((r) =>
          r._id === report._id ? { ...r, status: newStatus } : r
        )
      );
    } catch (error) {
      console.error("更新狀態失敗:", error);
      alert("更新失敗，請稍後再試");
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm("確定要永久刪除此回報嗎？此操作無法復原。")) {
      return;
    }

    try {
      // 真正從資料庫中刪除
      await deleteReport(reportId);

      // 從列表中移除
      setReports(reports.filter((r) => r._id !== reportId));

      console.log("✅ 問題回報已成功刪除");
    } catch (error) {
      console.error("刪除失敗:", error);
      alert("刪除失敗，請稍後再試");
    }
  };

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
    setShowDetailDialog(true);
  };

  const filteredReports = reports.filter((report) => {
    if (filter === "all") return true;
    if (filter === "pending") return report.status === "pending";
    if (filter === "resolved") return report.status === "resolved";
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      resolved: "bg-green-100 text-green-700",
      dismissed: "bg-gray-100 text-gray-600",
    };
    const labels = {
      pending: "待處理",
      resolved: "已完成",
      dismissed: "已忽略",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF7] to-[#F7E6C3]/20 relative overflow-hidden">
      <NatureAccents variant="minimal" />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-[#A8CBB7]/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-[#636e72] hover:text-[#2d3436]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <h2 className="text-[#2d3436]">問題回報管理</h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "default" : "outline"}
            className={
              filter === "all"
                ? "bg-[#A8CBB7] text-white"
                : "border-[#A8CBB7] text-[#A8CBB7]"
            }
          >
            全部 ({reports.length})
          </Button>
          <Button
            onClick={() => setFilter("pending")}
            variant={filter === "pending" ? "default" : "outline"}
            className={
              filter === "pending"
                ? "bg-[#A8CBB7] text-white"
                : "border-[#A8CBB7] text-[#A8CBB7]"
            }
          >
            待處理 ({reports.filter((r) => r.status === "pending").length})
          </Button>
          <Button
            onClick={() => setFilter("resolved")}
            variant={filter === "resolved" ? "default" : "outline"}
            className={
              filter === "resolved"
                ? "bg-[#A8CBB7] text-white"
                : "border-[#A8CBB7] text-[#A8CBB7]"
            }
          >
            已完成 ({reports.filter((r) => r.status === "resolved").length})
          </Button>
        </div>

        {/* Reports List */}
        <Card className="border-[#A8CBB7]/20">
          <CardHeader>
            <CardTitle className="text-[#2d3436] flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              問題回報列表
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#A8CBB7] animate-spin" />
                <span className="ml-3 text-[#636e72]">載入中...</span>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12 text-[#636e72]">
                {filter === "all"
                  ? "目前沒有任何回報"
                  : filter === "pending"
                  ? "目前沒有待處理的回報"
                  : "目前沒有已完成的回報"}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReports.map((report, index) => (
                  <motion.div
                    key={report._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`
                      p-4 rounded-lg border transition-all duration-200
                      ${
                        report.status === "resolved"
                          ? "bg-gray-50 border-gray-200"
                          : "bg-white border-[#A8CBB7]/20 hover:border-[#A8CBB7] hover:shadow-md"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(report.status)}
                          <span className="text-sm text-[#636e72]">
                            {formatDate(report.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`font-medium text-[#2d3436] ${
                              report.status === "resolved" ? "line-through" : ""
                            }`}
                          >
                            {report.bookName}
                          </span>
                          <span
                            className={`text-sm text-[#636e72] ${
                              report.status === "resolved" ? "line-through" : ""
                            }`}
                          >
                            {report.questionType}
                          </span>
                        </div>
                        <p
                          className={`text-sm text-[#636e72] line-clamp-2 ${
                            report.status === "resolved" ? "line-through" : ""
                          }`}
                        >
                          {report.questionContent}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleViewDetail(report)}
                          variant="ghost"
                          size="sm"
                          onMouseEnter={() => setHoveredButton(`eye-${report._id}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                          style={{
                            color: "#A8CBB7",
                            backgroundColor: hoveredButton === `eye-${report._id}` ? "rgba(168, 203, 183, 0.1)" : "transparent",
                            transition: "all 0.2s",
                          }}
                        >
                          <Eye style={{ width: "24px", height: "24px" }} />
                        </Button>
                        <Button
                          onClick={() => handleToggleResolved(report)}
                          variant="ghost"
                          size="sm"
                          onMouseEnter={() => setHoveredButton(`check-${report._id}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                          style={{
                            color: report.status === "resolved" ? "#6b7280" : "#16a34a",
                            backgroundColor: hoveredButton === `check-${report._id}`
                              ? (report.status === "resolved" ? "#d1d5db" : "#86efac")
                              : "transparent",
                            transform: hoveredButton === `check-${report._id}` ? "scale(1.1)" : "scale(1)",
                            transition: "all 0.2s",
                            boxShadow: hoveredButton === `check-${report._id}` && report.status !== "resolved"
                              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                              : "none",
                          }}
                        >
                          <CheckSquare
                            style={{ width: "24px", height: "24px" }}
                          />
                        </Button>
                        <Button
                          onClick={() => handleDelete(report._id)}
                          variant="ghost"
                          size="sm"
                          onMouseEnter={() => setHoveredButton(`delete-${report._id}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                          style={{
                            color: "#ef4444",
                            backgroundColor: hoveredButton === `delete-${report._id}` ? "#fee2e2" : "transparent",
                            transition: "all 0.2s",
                          }}
                        >
                          <Trash2 style={{ width: "24px", height: "24px" }} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#2d3436]">回報詳細內容</DialogTitle>
            <DialogDescription className="text-[#636e72]">
              提交時間：
              {selectedReport && formatDate(selectedReport.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-[#636e72]">
                  狀態
                </label>
                <div className="mt-1">
                  {getStatusBadge(selectedReport.status)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#636e72]">
                  書籍名稱
                </label>
                <p className="mt-1 text-[#2d3436]">{selectedReport.bookName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-[#636e72]">
                  題型
                </label>
                <p className="mt-1 text-[#2d3436]">
                  {selectedReport.questionType}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-[#636e72]">
                  題目內容
                </label>
                <p className="mt-1 text-[#2d3436] whitespace-pre-wrap">
                  {selectedReport.questionContent}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-[#636e72]">
                  問題描述
                </label>
                <p className="mt-1 text-[#2d3436] whitespace-pre-wrap">
                  {selectedReport.issueDescription}
                </p>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => {
                    handleToggleResolved(selectedReport);
                    setShowDetailDialog(false);
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckSquare style={{ width: "16px", height: "16px", marginRight: "8px" }} />
                  {selectedReport.status === "resolved"
                    ? "標記為待處理"
                    : "標記為已完成"}
                </Button>
                <Button
                  onClick={() => {
                    handleDelete(selectedReport._id);
                    setShowDetailDialog(false);
                  }}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  刪除
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
