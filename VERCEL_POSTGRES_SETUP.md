# Vercel Postgres Setup Guide

## 手順

### 1. Vercelダッシュボードにアクセス

https://vercel.com/dashboard にアクセスして、`tokyo-vegan-bites`プロジェクトを開きます。

### 2. Storageタブを開く

プロジェクトページで「Storage」タブをクリックします。

### 3. Postgresデータベースを作成

1. 「Create Database」ボタンをクリック
2. 「Postgres」を選択
3. データベース名を入力（例：`tokyo-vegan-bites-db`）
4. リージョンを選択（推奨：`Tokyo (ap-northeast-1)`）
5. 「Create」をクリック

### 4. 環境変数の自動設定を確認

データベースが作成されると、以下の環境変数が自動的にプロジェクトに追加されます：

- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 5. DATABASE_URL環境変数を設定

1. プロジェクトの「Settings」→「Environment Variables」に移動
2. 「Add New」をクリック
3. 以下を入力：
   - **Key**: `DATABASE_URL`
   - **Value**: `POSTGRES_URL`の値をコピー（または`$POSTGRES_URL`を参照）
   - **Environment**: Production, Preview, Development すべてにチェック
4. 「Save」をクリック

### 6. 再デプロイ

環境変数を設定したら、プロジェクトを再デプロイします：

1. 「Deployments」タブに移動
2. 最新のデプロイの右側にある「...」メニューをクリック
3. 「Redeploy」を選択

または、GitHubに新しいコミットをプッシュすると自動的に再デプロイされます。

## 次のステップ

データベースが設定されたら、以下を実行してデータベーススキーマを作成し、データを投入します：

```bash
# ローカルで環境変数を設定
export DATABASE_URL="<Vercel Postgresの接続URL>"

# スキーマを作成
pnpm db:push

# データを投入
pnpm tsx server/seed-data/seed-restaurants.ts
pnpm tsx server/seed-data/seed-menus-reviews.ts
```

## トラブルシューティング

### 接続エラーが発生する場合

1. `DATABASE_URL`が正しく設定されているか確認
2. Vercel Postgresのステータスを確認（ダッシュボードのStorageタブ）
3. 環境変数が本番環境に適用されているか確認

### データが表示されない場合

1. データベースにデータが投入されているか確認
2. シードスクリプトを実行
3. ログを確認（Vercelダッシュボードの「Logs」タブ）

## 参考リンク

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Drizzle ORM with PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)

