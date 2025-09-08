# summer-internship-2025

## ER 図

```mermaid

erDiagram

tenants {
    uuid id PK "ID"
    text name "テナント名"
    timestamp created_at "作成日時"
    timestamp updated_at "更新日時"
}

stores {
    uuid id PK "ID"
    text name "店舗名"
    text zip_code "郵便番号"
    text address "住所"
    text phone_number "電話番号"
    references tenant_id FK "tenants.id"
    timestamp created_at "作成日時"
    timestamp updated_at "更新日時"
    timestamp deleted_at "論理削除用のタイムスタンプ"
}

users {
    uuid id PK "ID"
    text name "氏名"
    text email "メールアドレス"
    text employee_number "従業員番号"
    references store_id FK "stores.id"
    timestamp created_at "作成日時"
    timestamp updated_at "更新日時"
    timestamp deleted_at "論理削除用のタイムスタンプ"
}

stocks {
    serial id PK "ID"
    text name "商品名"
    int quantity "数量"
    int price "単価"
    references store_id FK "stores.id"
    references user_id FK "users.id"
    timestamp created_at "作成日時"
    timestamp updated_at "更新日時"
}

customers {
    uuid id PK "ID"
    text name "取引先名"
    text email "メールアドレス"
    text phone_number "電話番号"
    text address "住所"
    references tenant_id FK "tenants.id"
    timestamp created_at "作成日時"
    timestamp updated_at "更新日時"
    timestamp deleted_at "論理削除用のタイムスタンプ"
}

orders {
    serial id PK "ID"
    int total_amount "発注総額"
    int quantity "発注数量"
    enum status "発注状態"
    date delivery_date "発送予定日"
    references stock_id FK "stocks.id"
    references customer_id FK "customers.id"
    timestamp created_at "作成日時"
    timestamp updated_at "更新日時"
}

order_status {
    text key "PENDING, SHIPPED, DELIVERED, CANCELLED"
}

tenants ||--|{ stores : "1つのテナント（会社）は複数の店舗を持つ"
tenants ||--o{ customers : "テナントは顧客を複数持つ"
stores ||--|{ users : "従業員は必ずどこかの店舗に所属する"
stores ||--o{ stocks : "店舗には複数の商品がある"
stocks |o--|| users : "商品情報を登録（更新）した人が必ず1人いる"
orders |o--|| stocks : "発注には必ず商品がある"
orders |o--|| customers : "発注には必ず取引先がある"
orders ||--|| order_status : "発注状態は特定のステータスに属する"

```

## BE開発環境セットアップ

```bash
$ make init

$ make migrate

$ make seed
```

### データベースマイグレーション

```bash
# DDLマイグレーション適用
$ make migrate

# Seedマイグレーション適用
$ make seed

# 新しいDDLマイグレーションファイル作成
$ make migrate-create-ddl NAME=add_new_table

# 新しいSeedマイグレーションファイル作成
$ make migrate-create-seed NAME=insert_test_data

# 全マイグレーション巻き戻し
$ make migrate-down
```

**開発フロー**:
1. `make init` - 環境構築（全サービス起動）
2. `make migrate` - スキーマ適用
3. `make seed` - 初期データ投入

## サーバー再起動

`make init` で既に全サービスが起動していますが、再起動が必要な場合：

```bash
# フォアグラウンドで起動
$ make up

# バックグラウンドで起動
$ make upd

# サービス停止
$ make down
```

## Seed データ管理

Seedデータは新しいマイグレーション機構で管理されています：

- **場所**: `server/migrations/seed/local/`
- **形式**: タイムスタンプ付きup/downファイル
- **適用**: `make seed`（`make init`に含まれる）

初期データには以下が含まれます：
- tenants (テナント情報)
- stores (店舗情報)
- users (ユーザー情報)
- customers (顧客情報)
- stocks (商品情報)
- orders (注文情報)

## 環境リセット・クリーンアップ

```bash
# コンテナ停止・削除
$ make down

# マイグレーション履歴リセット
$ make migrate-down

# ボリューム削除（データ完全削除）
$ make clean
```

### 使い分け
- **`make down`**: サービスを停止したい時
- **`make migrate-down`**: マイグレーション履歴をリセットしたい時
- **`make clean`**: データを完全に削除したい時（その後 `make init` が必要）

## 動作確認

Postman のような API 開発ツールを使っている場合は、`Authorization` ヘッダーに以下の値を設定して実行してください。

```txt:動作確認用のサンプルJWT
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhODdhMjQxZC0xZTkwLTQ5OTUtYjc5ZS04YTQ2N2NiYjA5YjUiLCJuYW1lIjoi44OQ44Kk44K744OrIOWkqumDjiIsImlhdCI6MTUxNjIzOTAyMiwidGVuYW50X2lkIjoiYWNiOGYzZjEtNTQzMi00NDI3LTljYTMtOWNlMGQ2MzZjMTdjIiwic3RvcmVfaWQiOiI0ZDYxOTRmZC1jM2QyLTQwNDgtOWM4MS1iNTAzYjY0MGVkYjgifQ.DzN5e8RLtFu7YK8dKwCDLVYseFNbPYFnE_lCPpG0T7U
```

![Postman 画面](/images/postman_display.png)

curl コマンドの場合は、以下のようにヘッダー情報を追加してコマンドを実行してください。

```bash:curlコマンド例（GET）
curl -X GET -L 'http://localhost:1234/v1/users' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhODdhMjQxZC0xZTkwLTQ5OTUtYjc5ZS04YTQ2N2NiYjA5YjUiLCJuYW1lIjoi44OQ44Kk44K744OrIOWkqumDjiIsImlhdCI6MTUxNjIzOTAyMiwidGVuYW50X2lkIjoiYWNiOGYzZjEtNTQzMi00NDI3LTljYTMtOWNlMGQ2MzZjMTdjIiwic3RvcmVfaWQiOiI0ZDYxOTRmZC1jM2QyLTQwNDgtOWM4MS1iNTAzYjY0MGVkYjgifQ.DzN5e8RLtFu7YK8dKwCDLVYseFNbPYFnE_lCPpG0T7U' -H 'Origin: http://localhost:1234' -H 'Content-Type: application/json'
```

```bash:curlコマンド例（POST）
curl -X POST -L 'http://localhost:1234/v1/users' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhODdhMjQxZC0xZTkwLTQ5OTUtYjc5ZS04YTQ2N2NiYjA5YjUiLCJuYW1lIjoi44OQ44Kk44K744OrIOWkqumDjiIsImlhdCI6MTUxNjIzOTAyMiwidGVuYW50X2lkIjoiYWNiOGYzZjEtNTQzMi00NDI3LTljYTMtOWNlMGQ2MzZjMTdjIiwic3RvcmVfaWQiOiI0ZDYxOTRmZC1jM2QyLTQwNDgtOWM4MS1iNTAzYjY0MGVkYjgifQ.DzN5e8RLtFu7YK8dKwCDLVYseFNbPYFnE_lCPpG0T7U' -H 'Origin: http://localhost:1234' -H 'Content-Type: application/json' -d '{"name": "テスト1", "email": "hoge@example.com", "employee_number": "1234567", "store_id": "4d6194fd-c3d2-4048-9c81-b503b640edb8"}'
```

## FE開発環境セットアップ

前提
- node、npm がインストール済み
- node バージョン > v20

```
# pnpm のインストール

npm install -g pnpm

# 依存関係のインストール
pnpm install

# APIクライアントコードの自動生成
pnpm generate:api

# ローカル起動
pnpm dev

```

### ローカルにアクセス

http://localhost:5173/

### FEの認証

FEからBEに疎通をして情報を取得するには、`frontend/.env` ファイルを作成し、以下の値を追加してください。

```
cp .env.example .env

VITE_API_AUTH_TOKEN = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhODdhMjQxZC0xZTkwLTQ5OTUtYjc5ZS04YTQ2N2NiYjA5YjUiLCJuYW1lIjoi44OQ44Kk44K744OrIOWkqumDjiIsImlhdCI6MTUxNjIzOTAyMiwidGVuYW50X2lkIjoiYWNiOGYzZjEtNTQzMi00NDI3LTljYTMtOWNlMGQ2MzZjMTdjIiwic3RvcmVfaWQiOiI0ZDYxOTRmZC1jM2QyLTQwNDgtOWM4MS1iNTAzYjY0MGVkYjgifQ.DzN5e8RLtFu7YK8dKwCDLVYseFNbPYFnE_lCPpG0T7U
```

## Swagger ( Open API )

### Swaggerの閲覧

`http://localhost:1234/v1/swagger/`

![Swagger 画面](/images/swagger_display.png)

### Swaggerの更新

`server/api/handler/` や `server/api/handler/request` を更新したら、以下のコマンドを実行してswaggerも更新する

```bash
make swag
```
