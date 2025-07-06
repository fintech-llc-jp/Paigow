#!/bin/bash

# Google Cloud setup script for Paigow Game
set -e

echo "🎮 Setting up Google Cloud for Paigow Game deployment..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI is not installed."
    echo "📥 Please install it from: https://cloud.google.com/sdk/docs/install"
    echo "🍺 Or use Homebrew: brew install --cask google-cloud-sdk"
    exit 1
fi

echo "✅ Google Cloud CLI found"

# List available projects
echo "📋 Available Google Cloud projects:"
gcloud projects list --format="table(projectId,name,projectNumber)"

echo ""
echo "🔧 Please follow these steps:"
echo "1. Go to https://console.cloud.google.com/"
echo "2. Create a new project or select existing one"
echo "3. Enable billing for the project"
echo "4. Note down your PROJECT_ID"
echo ""
echo "💡 After creating/selecting project, run:"
echo "   gcloud auth login"
echo "   gcloud config set project YOUR_PROJECT_ID"
echo "   ./deploy-cloudrun.sh"