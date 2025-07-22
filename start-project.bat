@echo off
echo Iniciando Clasificador de Acentos...
echo.

REM Agregar Node.js al PATH
set PATH=%PATH%;C:\Program Files\nodejs

echo Iniciando Backend...
start "Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"

timeout /t 3 /nobreak >nul

echo Iniciando Frontend...
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ✅ Servicios iniciados!
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:3001
echo.
pause