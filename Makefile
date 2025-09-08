init: # 初期化
	make bridge
	docker compose build --no-cache
	docker compose up -d

bridge: # Docker ネットワークを作成する。存在していれば何もしない
	docker network create --driver bridge api-network || true

up:
	docker compose up

upd:
	docker compose up -d

stop:
	docker compose stop

down:
	docker compose down

clean:
	make down
	docker volume rm $$(docker volume ls -qf name=summer-internship-2025) || true

# Database configuration
DB_HOST ?= pgsql
DB_USER ?= postgres
DB_NAME ?= api
DB_PASSWORD ?= password
DB_PORT ?= 15432

# データベース接続URL
DB_URL_HOST := postgres://$(DB_USER):$(DB_PASSWORD)@localhost:$(DB_PORT)/$(DB_NAME)?sslmode=disable

# DDLマイグレーションファイル作成
migrate-create-ddl:
	docker run --rm \
		-v `pwd`/server/migrations/ddl:/migrations \
		--network=host \
		migrate/migrate \
		-path=/migrations/ \
		-database "$(DB_URL_HOST)" \
		create --ext sql --dir migrations $(NAME)

# Seedマイグレーションファイル作成
migrate-create-seed:
	docker run --rm \
		-v `pwd`/server/migrations/seed/local:/migrations \
		--network=host \
		migrate/migrate \
		-path=/migrations/ \
		-database "$(DB_URL_HOST)" \
		create --ext sql --dir migrations $(NAME)

# マイグレーション適用
migrate:
	@echo "DDLマイグレーションを適用中..."
	docker run --rm \
		-v `pwd`/server/migrations/ddl:/migrations \
		--network=host \
		migrate/migrate \
		-path=/migrations/ \
		-database "$(DB_URL_HOST)&x-migrations-table=ddl_migrations" \
		up
	@echo "完了: DDLマイグレーションが適用されました"

# Seedマイグレーション適用
seed:
	@echo "Seedマイグレーションを適用中..."
	docker run --rm \
		-v `pwd`/server/migrations/seed/local:/migrations \
		--network=host \
		migrate/migrate \
		-path=/migrations/ \
		-database "$(DB_URL_HOST)&x-migrations-table=seed_migrations" \
		up
	@echo "完了: Seedマイグレーションが適用されました"


# マイグレーション全削除
migrate-down:
	@echo "Seedマイグレーションを巻き戻し中..."
	docker run --rm \
		-v `pwd`/server/migrations/seed/local:/migrations \
		--network=host \
		migrate/migrate \
		-path=/migrations/ \
		-database "$(DB_URL_HOST)&x-migrations-table=seed_migrations" \
		down -all
	@echo "DDLマイグレーションを巻き戻し中..."
	docker run --rm \
		-v `pwd`/server/migrations/ddl:/migrations \
		--network=host \
		migrate/migrate \
		-path=/migrations/ \
		-database "$(DB_URL_HOST)&x-migrations-table=ddl_migrations" \
		down -all
	@echo "完了: 全てのマイグレーションが巻き戻されました"

swag:
	@docker compose exec api swag fmt
	docker compose exec api swag init --parseDependency --parseInternal
