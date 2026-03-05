@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Questiona - Local Dev Runner
echo ========================================
echo.
echo Starting 3 services in separate windows:
echo   Server    -^> http://localhost:3001
echo   Frontend  -^> http://localhost:3000
echo   Collector -^> http://localhost:8888
echo.
echo IMPORTANT: Make sure Qdrant is running first!
echo   docker run -p 6333:6333 qdrant/qdrant
echo.

set ROOT=%~dp0
set ROOT=%ROOT:~0,-1%

:: Start Server
start "Questiona - SERVER" cmd /k "cd /d "%ROOT%\server" && echo [SERVER starting on port 3001...] && yarn dev"

timeout /t 2 /nobreak >nul

:: Start Collector  
start "Questiona - COLLECTOR" cmd /k "cd /d "%ROOT%\collector" && echo [COLLECTOR starting...] && yarn dev"

timeout /t 2 /nobreak >nul

:: Start Frontend
start "Questiona - FRONTEND" cmd /k "cd /d "%ROOT%\frontend" && echo [FRONTEND starting on port 3000...] && yarn dev"

echo.
echo All 3 service windows have been opened.
echo Open http://localhost:3000 in your browser.
echo.
pause
