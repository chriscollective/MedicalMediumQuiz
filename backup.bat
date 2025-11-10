@echo off
chcp 65001 >nul
echo ========================================
echo   MongoDB 資料庫備份工具
echo ========================================
echo.

REM 載入環境變數
call .env

REM 執行備份腳本
npx tsx server/src/scripts/backup-database.ts

echo.
echo ========================================
echo   備份完成！
echo ========================================
pause
