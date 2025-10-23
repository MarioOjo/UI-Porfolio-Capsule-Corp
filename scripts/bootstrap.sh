#!/usr/bin/env bash
set -euo pipefail

echo "Installing frontend dependencies..."
cd frontend
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
cd - >/dev/null

echo "Installing backend dependencies..."
cd backend
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi
cd - >/dev/null

echo "Bootstrap complete."