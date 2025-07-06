#!/bin/bash

# Development workflow script
set -e

case "$1" in
  "dev")
    echo "🛠️ Starting development server..."
    npm run dev
    ;;
  "build")
    echo "🏗️ Building for production..."
    npm run build
    ;;
  "test-build")
    echo "🧪 Testing production build locally..."
    npm run build
    docker build -t paigow-local .
    docker run -p 3000:80 paigow-local
    ;;
  "deploy")
    echo "🚀 Deploying to Cloud Run..."
    ./quick-deploy.sh
    ;;
  "logs")
    echo "📋 Fetching Cloud Run logs..."
    gcloud run logs tail paigow-game --region=asia-northeast1
    ;;
  "status")
    echo "📊 Cloud Run service status..."
    gcloud run services describe paigow-game --region=asia-northeast1
    ;;
  *)
    echo "🎮 Paigow Development Workflow"
    echo ""
    echo "Usage: $0 {dev|build|test-build|deploy|logs|status}"
    echo ""
    echo "Commands:"
    echo "  dev        - Start development server"
    echo "  build      - Build for production"
    echo "  test-build - Test production build locally"
    echo "  deploy     - Deploy to Cloud Run"
    echo "  logs       - View Cloud Run logs"
    echo "  status     - Check service status"
    ;;
esac