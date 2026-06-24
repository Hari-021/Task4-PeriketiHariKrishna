#!/bin/bash
set -e

echo "Building NextRound AI..."
npm run build

echo "Starting with PM2..."
pm install -g serve pm2 2>/dev/null || true

pm2 delete nextround-ai 2>/dev/null || true
pm2 serve dist 3000 --name "nextround-ai" --spa
pm2 startup
pm2 save

echo "NextRound AI is running on port 3000"
echo "To check status: pm2 status"
echo "To view logs: pm2 logs nextround-ai"
