# Paigow Project - Claude Notes

## プロジェクト概要
牌九（Paigow）カジノゲームのWebアプリケーション
- React + TypeScript + Styled Components
- Zustand状態管理
- Web Audio API使用

## PropellerAds収益化情報
### 登録情報
- 登録URL: https://partners.propellerads.com/#/auth/signUp
- アカウントタイプ: Publisher
- 審査: 即時承認（審査なし）
- 最低トラフィック要件: なし

### 支払い情報
- 最低支払額: $5（PayPal, Skrill等）
- Payoneer: $20
- 銀行送金: $550
- 支払いスケジュール: 毎週木曜日（Net 7日）

### 対応広告形式
- バナー広告
- ポップアンダー
- インタースティシャル
- プッシュ通知
- ネイティブ広告

### 連絡先
- Email: contact.us@propellerads.com
- 電話: +35725281664
- ヘルプ: https://help.propellerads.com/en/

### サイト要件
- ✅ コンテンツベースのサイト
- ✅ 完全に機能するサイト
- ❌ アダルトコンテンツ禁止
- ❌ ヘイトスピーチ禁止
- ❌ 建設中サイト禁止

## プロジェクト改善履歴

### UI/UX改善
- **判定結果表示の改善**: 画面下部から中央モーダル表示に変更
  - `ResultModal`と`ResultContent`コンポーネント追加
  - レスポンシブ対応
  - スクロール不要で結果確認可能

### サウンドシステム改善
- **勝敗サウンドの変更**:
  - 勝利時: YouWon.mp3（著作権フリー・商用利用可能）
  - 敗北時: YouLose.mp3（著作権フリー・商用利用可能）
  - 引き分け: 中性的なビープ音（440Hz、プログラム生成）
  - カード配布: 短いビープ音（880Hz、プログラム生成）
- **ハイブリッド実装**: MP3ファイル + Web Audio API

### 技術実装
- HTML Audio Elements（MP3再生用）
- Web Audio API（効果音生成用）
- パブリックディレクトリ配置（/public/sounds/）
- ユーザーインタラクション後の自動初期化

### デプロイ対応
- MP3ファイルをpublic/sounds/に移動
- TypeScriptインポートエラー解決
- 未使用関数の削除でコードクリーンアップ

## 開発メモ
- ギャンブル系コンテンツのため、Google AdSenseは使用困難
- PropellerAdsなどギャンブル対応ネットワークを推奨
- 無料ゲームであることを明確化することが重要

## 今後の検討事項
- 収益最適化のためのA/Bテスト
- 追加広告ゾーンの検討

## 広告実装完了
### Monetag (PropellerAds) 広告統合
- **広告タグ**: https://fpyf8.com/88/tag.min.js (Zone: 156474)
- **配置**: 右側サイドバー（320px幅）
- **レスポンシブ**: 1200px以下で下部表示に切り替え
- **実装方式**: React useEffect + 動的スクリプト挿入
- **sw.js**: public/sw.js に配置済み（プッシュ通知対応）

### レイアウト変更
- **2カラムレイアウト**: ゲームエリア + 広告サイドバー
- **モバイル対応**: 縦並びレイアウトに自動切り替え
- **広告エリア**: 複数の広告コンテナで収益最大化
