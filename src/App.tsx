import React, { useState, useEffect, lazy, Suspense } from "react";
import { LandingPage } from "./pages/LandingPage";
import { QuizPage } from "./pages/QuizPage";
import { ResultPage } from "./pages/ResultPage";
import { Question } from "./components/QuestionCard";
import { getToken, getCurrentUser } from "./services/authService";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SEO } from "./components/SEO";

// ============================================
// Code Splitting: 按需載入頁面（減少初始 bundle 大小）
// ============================================
// 管理員相關頁面（只有管理員會用到，約 40% 的使用者不會訪問）
const AdminLogin = lazy(() => import("./pages/AdminLogin").then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const Analytics = lazy(() => import("./pages/Analytics").then(m => ({ default: m.Analytics })));
const AdminSettings = lazy(() => import("./pages/AdminSettings").then(m => ({ default: m.AdminSettings })));
const QuestionBank = lazy(() => import("./pages/QuestionBank").then(m => ({ default: m.QuestionBank })));
const ReportManagement = lazy(() => import("./pages/ReportManagement").then(m => ({ default: m.ReportManagement })));

// 次要頁面（不是核心測驗流程）
const Leaderboard = lazy(() => import("./pages/Leaderboard").then(m => ({ default: m.Leaderboard })));
const About = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const CorrectionNotice = lazy(() => import("./pages/CorrectionNotice").then(m => ({ default: m.CorrectionNotice })));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })));

type AppPage =
  | "landing"
  | "quiz"
  | "result"
  | "admin-login"
  | "admin-dashboard"
  | "analytics"
  | "questions"
  | "leaderboard"
  | "reports"
  | "settings"
  | "about"
  | "correction-notice"
  | "privacy-policy";

interface QuizState {
  books: string[];
  difficulty: "beginner" | "advanced";
  answers: Record<string, string | string[]>;
  quizId: string;  // 🔒 新增：測驗 ID（用於安全驗證排行榜）
  score: number;
  totalQuestions: number;
  wrongQuestions: Array<{
    question: Question;
    userAnswer: string | string[];
  }>;
}

// 測驗總題數常數
const QUIZ_TOTAL_QUESTIONS = 20;

// Loading 組件（用於 Suspense fallback）
function PageLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FAFAF7",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #E5C17A",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p style={{ color: "#636e72", fontSize: "14px" }}>載入中...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>("landing");
  const [quizState, setQuizState] = useState<QuizState>({
    books: [],
    difficulty: "beginner",
    answers: {},
    quizId: '',  // 初始為空
    score: 0,
    totalQuestions: 0,
    wrongQuestions: [],
  });
  const [adminUser, setAdminUser] = useState<string>("");
  const [leaderboardSource, setLeaderboardSource] = useState<
    "landing" | "admin-dashboard"
  >("landing");

  // Check if user is already logged in on page load
  useEffect(() => {
    const token = getToken();
    const currentUser = getCurrentUser();

    if (token && currentUser) {
      setAdminUser(currentUser.username);
      // Restore the admin page from localStorage if available
      const savedPage = localStorage.getItem("adminCurrentPage");
      if (
        savedPage &&
        (savedPage === "admin-dashboard" ||
          savedPage === "analytics" ||
          savedPage === "questions")
      ) {
        setCurrentPage(savedPage as AppPage);
      } else {
        setCurrentPage("admin-dashboard");
      }
    }
  }, []);

  // 切換到部份頁面時自動捲動到頂端
  useEffect(() => {
    if (
      currentPage === "about" ||
      currentPage === "leaderboard" ||
      currentPage === "correction-notice" ||
      currentPage === "privacy-policy" ||
      currentPage === "result"
    ) {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } catch (_) {
        // 後援：部分環境不支援帶選項
        window.scrollTo(0, 0);
      }
    }
  }, [currentPage]);

  const handleStartQuiz = (
    books: string[],
    difficulty: "beginner" | "advanced"
  ) => {
    setQuizState({
      books,
      difficulty,
      answers: {},
      quizId: '',  // 初始為空，完成測驗後才會有值
      score: 0,
      totalQuestions: QUIZ_TOTAL_QUESTIONS,
      wrongQuestions: [],
    });
    setCurrentPage("quiz");
  };

  const handleQuizComplete = (result: {
    quizId: string;  // 🔒 新增：測驗 ID
    score: number;
    totalQuestions: number;
    wrongQuestions: Array<{
      question: Question;
      userAnswer: string | string[];
    }>;
    answers: Record<string, string | string[]>;
  }) => {
    setQuizState((prev) => ({
      ...prev,
      quizId: result.quizId,  // 🔒 儲存 quizId 用於排行榜驗證
      answers: result.answers,
      score: result.score,
      totalQuestions: result.totalQuestions,
      wrongQuestions: result.wrongQuestions,
    }));
    setCurrentPage("result");
  };

  const handleRestartQuiz = () => {
    setCurrentPage("landing");
  };

  const handleAdminLogin = (username: string) => {
    setAdminUser(username);
    setCurrentPage("admin-dashboard");
    // Save the dashboard page to localStorage
    localStorage.setItem("adminCurrentPage", "admin-dashboard");
  };

  const handleAdminLogout = () => {
    setAdminUser("");
    setCurrentPage("landing");
    // Clear the saved admin page from localStorage
    localStorage.removeItem("adminCurrentPage");
  };

  const handleAdminNavigate = (
    page: "analytics" | "questions" | "leaderboard" | "settings"
  ) => {
    if (page === "leaderboard") {
      setLeaderboardSource("admin-dashboard");
    }
    setCurrentPage(page);
    // Save the current admin page to localStorage
    localStorage.setItem("adminCurrentPage", page);
  };

  // 根據當前頁面返回對應的 SEO 設定
  const getSEOProps = () => {
    switch (currentPage) {
      case "landing":
        return {
          title: "醫療靈媒隨堂測驗 | Medical Medium Quiz",
          description: "測試您對醫療靈媒書籍的理解程度，挑戰初階或進階題目，獲得專屬等級評定！",
        };
      case "quiz":
        return {
          title: `正在測驗 - 醫療靈媒隨堂測驗`,
          description: `正在進行${quizState.books.join("、")}的${quizState.difficulty === "beginner" ? "初階" : "進階"}測驗`,
        };
      case "result":
        return {
          title: "測驗結果 - 醫療靈媒隨堂測驗",
          description: `您答對了 ${quizState.score} / ${quizState.totalQuestions} 題！查看您的等級評定與錯題解析。`,
        };
      case "leaderboard":
        return {
          title: "排行榜 - 醫療靈媒隨堂測驗",
          description: "查看各書籍測驗的排行榜，看看您在全球玩家中的排名！",
        };
      case "about":
        return {
          title: "關於我們 - 醫療靈媒隨堂測驗",
          description: "了解醫療靈媒隨堂測驗的使命與目標",
        };
      case "correction-notice":
        return {
          title: "修正公告 - 醫療靈媒隨堂測驗",
          description: "查看最新的題目修正與更新公告",
        };
      case "privacy-policy":
        return {
          title: "隱私權政策 - 醫療靈媒隨堂測驗",
          description: "醫療靈媒隨堂測驗的隱私權政策與使用條款",
        };
      default:
        return {};
    }
  };

  return (
    <div className="min-h-screen">
      {/* SEO Meta 標籤 */}
      <SEO {...getSEOProps()} />

      {/* 核心頁面：立即載入（不需要 Suspense） */}
      {currentPage === "landing" && (
        <LandingPage
          onStart={handleStartQuiz}
          onAdminClick={() => setCurrentPage("admin-login")}
          onLeaderboardClick={() => {
            setLeaderboardSource("landing");
            setCurrentPage("leaderboard");
          }}
          onAboutClick={() => setCurrentPage("about")}
          onCorrectionNoticeClick={() => setCurrentPage("correction-notice")}
          onPrivacyClick={() => setCurrentPage("privacy-policy")}
        />
      )}

      {currentPage === "quiz" && (
        <QuizPage
          books={quizState.books}
          difficulty={quizState.difficulty}
          onComplete={handleQuizComplete}
          onBack={() => setCurrentPage("landing")}
        />
      )}

      {currentPage === "result" && (
        <ResultPage
          quizId={quizState.quizId}  // 🔒 傳遞 quizId 用於安全驗證
          score={quizState.score}
          totalQuestions={quizState.totalQuestions}
          wrongQuestions={quizState.wrongQuestions}
          books={quizState.books}
          difficulty={quizState.difficulty}
          userId={localStorage.getItem("quizUserId") || `user_${Date.now()}`}
          onRestart={handleRestartQuiz}
          onHome={() => setCurrentPage("landing")}
        />
      )}

      {/* 動態載入頁面：按需載入（使用 Suspense） */}
      <Suspense fallback={<PageLoading />}>
        {currentPage === "admin-login" && (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBack={() => setCurrentPage("landing")}
          />
        )}

        {currentPage === "admin-dashboard" && (
          <AdminDashboard
            username={adminUser}
            onNavigate={handleAdminNavigate}
            onLogout={handleAdminLogout}
          />
        )}

        {currentPage === "analytics" && (
          <Analytics onBack={() => setCurrentPage("admin-dashboard")} />
        )}

        {currentPage === "questions" && (
          <QuestionBank onBack={() => setCurrentPage("admin-dashboard")} />
        )}

        {currentPage === "reports" && (
          <ReportManagement onBack={() => setCurrentPage("admin-dashboard")} />
        )}

        {currentPage === "leaderboard" && (
          <Leaderboard onBack={() => setCurrentPage(leaderboardSource)} />
        )}

        {currentPage === "settings" && (
          <AdminSettings onBack={() => setCurrentPage("admin-dashboard")} />
        )}

        {currentPage === "about" && (
          <About onBack={() => setCurrentPage("landing")} />
        )}

        {currentPage === "correction-notice" && (
          <CorrectionNotice onBack={() => setCurrentPage("landing")} />
        )}

        {currentPage === "privacy-policy" && (
          <PrivacyPolicy onBack={() => setCurrentPage("landing")} />
        )}
      </Suspense>

      {/* Vercel Analytics - 追蹤網站流量 */}
      <VercelAnalytics />
    </div>
  );
}

export default App;
