#!/bin/bash

echo "=================================="
echo "FainPlanning - Build Script"
echo "=================================="
echo ""
echo "Installing dependencies..."
cd client
npm install

echo ""
echo "Building React app..."
npm run build

echo ""
echo "Building Electron app for Windows..."
npm run electron-build

echo ""
echo "✅ Build complete!"
echo "Look for FainPlanning Setup in: dist/ folder"
echo ""
