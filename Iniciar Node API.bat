@echo off
pushd "%~dp0API"
echo Iniciando servidor de Node.js...
call npm run dev
pause