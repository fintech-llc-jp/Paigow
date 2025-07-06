#!/bin/bash

# Quick redeploy script for Paigow Game
set -e

echo "🔄 Quick Redeploy Starting..."

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes. Commit them? (y/N)"
    read -p "> " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📝 Committing changes..."
        git add .
        read -p "📄 Commit message: " commit_msg
        git commit -m "$commit_msg"
    fi
fi

# Get current project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No project set. Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

SERVICE_NAME="paigow-game"
REGION="asia-northeast1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🎮 Redeploying to: ${PROJECT_ID}"

# Quick build and deploy (skip API enabling since already done)
echo "🐳 Building new image..."
docker build -t ${IMAGE_NAME}:latest . --quiet

echo "📤 Pushing to registry..."
docker push ${IMAGE_NAME}:latest

echo "🚀 Updating Cloud Run service..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --region ${REGION} \
  --quiet

# Get URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(status.url)")

echo ""
echo "✅ Redeploy complete!"
echo "🌐 ${SERVICE_URL}"
echo "⏱️  Total time: ~2-3 minutes"