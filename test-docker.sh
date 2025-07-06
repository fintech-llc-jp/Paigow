#!/bin/bash

# Test Docker containers locally before Cloud Run deployment
set -e

echo "🧪 Testing Docker containers locally..."

# Test Node.js version
echo ""
echo "📦 Testing Node.js serve version..."
docker build -f Dockerfile.node -t paigow-test-node .
echo "🚀 Starting on port 8080 (Ctrl+C to stop)..."
echo "🌐 Test URL: http://localhost:8080"
PORT=8080 docker run -p 8080:8080 -e PORT=8080 paigow-test-node

# Uncomment to test nginx version
# echo ""
# echo "📦 Testing Nginx version..."
# docker build -f Dockerfile.cloudrun -t paigow-test-nginx .
# echo "🚀 Starting on port 8081 (Ctrl+C to stop)..."
# echo "🌐 Test URL: http://localhost:8081"
# PORT=8081 docker run -p 8081:8081 -e PORT=8081 paigow-test-nginx