@echo off
title Tayyar Download Manager
cd /d "%~dp0"

echo Closing any previous running instances...
taskkill /F /IM electron.exe >nul 2>&1
taskkill /F /IM Tayyar.exe >nul 2>&1

echo Starting Tayyar with fresh UI...
set ELECTRON_RUN_AS_NODE=
start "" "node_modules\electron\dist\electron.exe" .

