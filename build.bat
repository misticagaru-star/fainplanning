@echo off
echo ==================================
echo FainPlanning - Build Script
echo ==================================
echo.
echo Installing dependencies...
cd client
call npm install

echo.
echo Building React app...
call npm run build

echo.
echo Building Electron app for Windows...
call npm run electron-build

echo.
echo Build complete!
echo Look for FainPlanning Setup in: dist folder
echo.
pause
