@echo off
title Tayyar GitHub Push
cd /d "%~dp0"
echo ====================================================
echo  Tayyar Download Manager - Push to GitHub
echo  Repository: https://github.com/mumenmahbuobeh/tayyar
echo ====================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Project pushed successfully to GitHub!
) else (
    echo [NOTICE] If prompted, please authenticate via your browser.
)
echo.
pause
