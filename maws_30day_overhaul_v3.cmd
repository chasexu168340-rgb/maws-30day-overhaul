@echo off
setlocal
cd /d "%~dp0"
node scripts\serve_maws.mjs --port 5174 --open
pause
