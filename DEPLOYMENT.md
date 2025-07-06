# 🚀 Google Cloud Run デプロイガイド

このガイドでは牌九ゲームをGoogle Cloud Runにデプロイする手順を説明します。

## 📋 前提条件

- Google Cloud アカウント
- Google Cloud CLI (gcloud) インストール済み
- Docker インストール済み
- プロジェクトで課金が有効

## 🔧 セットアップ

### 1. Google Cloud CLI のインストール

```bash
# macOS (Homebrew)
brew install --cask google-cloud-sdk

# その他のOS
# https://cloud.google.com/sdk/docs/install からダウンロード
```

### 2. Google Cloud プロジェクトの準備

```bash
# 1. Google Cloud Console にアクセス
# https://console.cloud.google.com/

# 2. 新しいプロジェクトを作成または既存プロジェクトを選択

# 3. 課金を有効化

# 4. 以下のコマンドでセットアップ確認
./setup-gcloud.sh
```

### 3. 認証とプロジェクト設定

```bash
# Google アカウントでログイン
gcloud auth login

# プロジェクトIDを設定 (YOUR_PROJECT_IDを実際のIDに置換)
gcloud config set project YOUR_PROJECT_ID

# 設定確認
gcloud config list
```

## 🚀 デプロイ実行

### ワンクリックデプロイ

```bash
# デプロイ実行
./deploy-cloudrun.sh
```

### 手動デプロイ (詳細制御が必要な場合)

```bash
# 1. 必要なAPIを有効化
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# 2. Dockerイメージをビルド
docker build -t gcr.io/YOUR_PROJECT_ID/paigow-game:latest .

# 3. Container Registryにプッシュ
docker push gcr.io/YOUR_PROJECT_ID/paigow-game:latest

# 4. Cloud Runにデプロイ
gcloud run deploy paigow-game \
  --image gcr.io/YOUR_PROJECT_ID/paigow-game:latest \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --port 80
```

## 📊 デプロイ後の管理

### サービス状況確認

```bash
# サービス一覧
gcloud run services list

# 詳細情報
gcloud run services describe paigow-game --region=asia-northeast1
```

### ログ確認

```bash
# リアルタイムログ
gcloud run logs tail paigow-game --region=asia-northeast1

# 過去のログ
gcloud run logs read paigow-game --region=asia-northeast1 --limit=50
```

### カスタムドメイン設定 (オプション)

```bash
# ドメインマッピング作成
gcloud run domain-mappings create \
  --service paigow-game \
  --domain your-domain.com \
  --region=asia-northeast1
```

## 💰 コスト最適化

### 最小設定でのデプロイ

```bash
gcloud run deploy paigow-game \
  --image gcr.io/YOUR_PROJECT_ID/paigow-game:latest \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --memory 256Mi \
  --cpu 0.5 \
  --concurrency 80 \
  --max-instances 5 \
  --min-instances 0
```

### 予想コスト
- **無料枠**: 月2百万リクエストまで無料
- **低トラフィック**: 月額 $0-5
- **中トラフィック**: 月額 $5-20

## 🔒 セキュリティ設定

### 認証が必要な場合

```bash
# 認証必須でデプロイ
gcloud run deploy paigow-game \
  --image gcr.io/YOUR_PROJECT_ID/paigow-game:latest \
  --no-allow-unauthenticated
```

### IAMでアクセス制御

```bash
# 特定ユーザーにアクセス権限付与
gcloud run services add-iam-policy-binding paigow-game \
  --member="user:user@example.com" \
  --role="roles/run.invoker" \
  --region=asia-northeast1
```

## 🛠️ トラブルシューティング

### よくある問題

1. **プロジェクトIDが設定されていない**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **課金が有効化されていない**
   - Google Cloud Console で課金を有効化

3. **APIが有効化されていない**
   ```bash
   gcloud services enable cloudbuild.googleapis.com run.googleapis.com
   ```

4. **Dockerが動作していない**
   ```bash
   docker --version
   # Dockerを起動してください
   ```

### サービス削除

```bash
# Cloud Run サービス削除
gcloud run services delete paigow-game --region=asia-northeast1

# Container Registry イメージ削除
gcloud container images delete gcr.io/YOUR_PROJECT_ID/paigow-game:latest
```

## 📞 サポート

- [Google Cloud Run ドキュメント](https://cloud.google.com/run/docs)
- [Container Registry ドキュメント](https://cloud.google.com/container-registry/docs)
- [Google Cloud サポート](https://cloud.google.com/support)

---

🎮 **Happy Gaming!** 何か問題があれば、ログを確認して対応してください。