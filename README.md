# Tokyo Vegan Bites 🌱

東京のビーガン・ベジタリアンレストランを発見するためのモダンなWebアプリケーション

![Tokyo Vegan Bites](./client/public/images/tokyo-night.jpg)

## 概要

**Tokyo Vegan Bites**は、東京のビーガン・ベジタリアンレストランを簡単に見つけることができるWebアプリケーションです。TikTokスタイルのインタラクティブなUI、AI搭載の検索機能、そしてシネマティックなウェルカム体験を提供します。

## 主な機能

### 🎬 シネマティックなウェルカム体験
- 東京タワーの美しい夜景を背景にした映画のようなオープニング
- スローズームアニメーション、グラデーションテキスト効果
- 段階的なフェードインアニメーション

### 📱 TikTokスタイルのビデオフィード
- 縦型フルスクリーンUIでレストランの魅力的な料理写真を閲覧
- スワイプ操作で次のレストランへ
- ブックマーク、シェア、ナビゲーション機能

### 🗺️ インタラクティブなレストラン検索
- **Mapビュー**: OpenStreetMapベースのインタラクティブマップ
- **Gridビュー**: カード形式でレストラン一覧を表示
- **カテゴリーフィルター**: Ramen, Burger, Japanese, Cafe, Chinese, Italian, Thai

### 🤖 AI搭載の検索機能
- 自然言語でレストランを検索
- "Best vegan burger in Tokyo"のような質問に対して最適なレストランを推奨
- レストランの詳細情報と推奨理由を表示

### 📖 詳細なレストラン情報
- 高品質な料理写真
- レストラン名（英語・日本語）
- Veganバッジ（100% Vegan / Vegan Options）
- カテゴリーと価格帯
- 住所、営業時間、電話番号
- ウェブサイトとSNSリンク
- メニュー（画像と価格付き）
- ビデオコンテンツ

### ⭐ ブックマーク機能
- お気に入りのレストランを保存
- 認証システムと統合
- ユーザーごとにブックマークを管理

### 🎯 オンボーディングフロー
- 初回訪問時に食事制限を選択（Vegan、Vegetarian、Gluten-free）
- 3ステップのスムーズなオンボーディング

## 技術スタック

### フロントエンド
- **React** - UIライブラリ
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **Wouter** - ルーティング
- **TanStack Query** - データフェッチング
- **Leaflet** - マップ表示

### バックエンド
- **Express** - Webサーバー
- **tRPC** - 型安全なAPI
- **SQLite** - データベース
- **Drizzle ORM** - データベースORM

### 認証
- **OAuth 2.0** - Manusプラットフォーム統合
- **セッションCookie** - 認証状態管理

## セットアップ

### 前提条件
- Node.js 22.x
- pnpm

### インストール

```bash
# リポジトリのクローン
git clone <repository-url>
cd tokyo-vegan-bites

# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集して必要な環境変数を設定

# データベースのセットアップ
pnpm db:push

# 開発サーバーの起動
pnpm dev
```

### 環境変数

必要な環境変数は`.env.example`を参照してください。

主な環境変数:
- `VITE_APP_ID` - アプリケーションID
- `VITE_OAUTH_PORTAL_URL` - OAuth認証ポータルURL
- `DATABASE_URL` - データベース接続URL

## 開発

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで `http://localhost:3002` を開きます。

### データベースマイグレーション

```bash
# マイグレーションの生成
pnpm db:generate

# マイグレーションの適用
pnpm db:push

# Drizzle Studioの起動（データベースGUI）
pnpm db:studio
```

### ビルド

```bash
pnpm build
```

### 本番環境での起動

```bash
pnpm start
```

## プロジェクト構造

```
tokyo-vegan-bites/
├── client/                 # フロントエンドコード
│   ├── public/            # 静的ファイル
│   │   └── images/        # 画像ファイル
│   └── src/
│       ├── components/    # Reactコンポーネント
│       ├── pages/         # ページコンポーネント
│       ├── lib/           # ユーティリティ
│       └── _core/         # コア機能
├── server/                # バックエンドコード
│   ├── routers.ts         # tRPCルーター
│   ├── db.ts              # データベース関数
│   └── _core/             # コア機能
├── db/                    # データベースファイル
└── shared/                # 共有型定義
```

## テスト

詳細なテスト結果は`TEST_RESULTS.md`を参照してください。

すべての主要機能が正常に動作することを確認済みです:
- ✅ ウェルカム画面とオンボーディング
- ✅ TikTokスタイルのビデオフィード
- ✅ レストラン詳細ページ
- ✅ Browse（Map/Gridビュー）
- ✅ AI検索機能
- ✅ ブックマーク機能
- ✅ ナビゲーションとルーティング

## コンテスト提出

コンテスト提出資料は`CONTEST_SUBMISSION.md`を参照してください。

完成報告書は`COMPLETION_REPORT.md`を参照してください。

## ライセンス

MIT

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 開発者

Manus AI Agent

## 謝辞

- OpenStreetMap - マップデータ
- Leaflet - マップライブラリ
- Manus Platform - 認証とホスティング

---

**Tokyo Vegan Bites** - 東京のビーガン・ベジタリアンレストランを発見しよう 🌱

