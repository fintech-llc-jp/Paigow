#!/bin/bash

# Google Cloud Run deployment script for Paigow Game
set -e

# Configuration
SERVICE_NAME="paigow-game"
REGION="asia-northeast1"  # Tokyo region

# Get project ID from gcloud config or prompt user
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No project set in gcloud config"
    echo "🔧 Please set your project first:"
    echo "   gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🎮 Deploying Paigow Game to Google Cloud Run..."
echo "📋 Project: ${PROJECT_ID}"
echo "🌏 Region: ${REGION}"
echo "🐳 Image: ${IMAGE_NAME}"

# Confirm deployment
echo ""
read -p "🚀 Deploy to Cloud Run? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and push Docker image
echo "🐳 Building Docker image..."
docker build --platform linux/amd64 -t ${IMAGE_NAME}:latest .

echo "📤 Pushing image to Container Registry..."
docker push ${IMAGE_NAME}:latest

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 2 \
  --concurrency 1000 \
  --max-instances 10 \
  --min-instances 0 \
  --port 8080 \
  --set-env-vars NODE_ENV=production

# Get service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(status.url)")

echo ""
echo "========================================"
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "========================================"
echo "🌐 Game URL: ${SERVICE_URL}"
echo "📋 Project: ${PROJECT_ID}"
echo "🌏 Region: ${REGION}"
echo "🐳 Image: ${IMAGE_NAME}:latest"
echo ""
echo "🛠️ Management Commands:"
echo "  View logs:    gcloud run logs tail ${SERVICE_NAME} --region=${REGION}"
echo "  View service: gcloud run services describe ${SERVICE_NAME} --region=${REGION}"
echo "  Delete:       gcloud run services delete ${SERVICE_NAME} --region=${REGION}"
echo ""
echo "🔄 To redeploy: ./deploy-cloudrun.sh"
echo "🎉 Happy gaming!"
echo "========================================"