.PHONY: help dev build start install lint format typecheck clean \
        supabase-start supabase-stop supabase-status supabase-reset \
        db-push db-migrate db-types db-studio db-diff \
        stripe-listen

# デフォルトターゲット: ヘルプを表示
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "=== Next.js ==="
	@echo "  dev          - 開発サーバーを起動"
	@echo "  build        - プロダクションビルド"
	@echo "  start        - プロダクションサーバーを起動"
	@echo "  install      - 依存関係をインストール"
	@echo "  lint         - Biome lint を実行"
	@echo "  format       - Biome format を実行"
	@echo "  typecheck    - TypeScript 型チェック"
	@echo "  clean        - ビルドキャッシュを削除"
	@echo ""
	@echo "=== Supabase ==="
	@echo "  supabase-start  - Supabase ローカル環境を起動"
	@echo "  supabase-stop   - Supabase ローカル環境を停止"
	@echo "  supabase-status - Supabase ステータスを確認"
	@echo "  supabase-reset  - Supabase DB をリセット (マイグレーション再実行)"
	@echo ""
	@echo "=== Database ==="
	@echo "  db-types     - Supabase 型定義を生成"
	@echo "  db-push      - ローカルスキーマをリモートにプッシュ"
	@echo "  db-migrate   - 新しいマイグレーションを作成 (name=xxx)"
	@echo "  db-studio    - Supabase Studio を開く"
	@echo "  db-diff      - スキーマの差分を表示"
	@echo ""
	@echo "=== Stripe ==="
	@echo "  stripe-listen - Stripe Webhook をローカルにフォワード"
	@echo ""
	@echo "=== All in One ==="
	@echo "  setup        - 初期セットアップ (install + supabase-start + db-types)"
	@echo "  up           - 開発環境を起動 (supabase-start + dev)"

# ========================
# Next.js Commands
# ========================
dev:
	pnpm run dev

build:
	pnpm run build

start:
	pnpm run start

install:
	pnpm install

lint:
	npx @biomejs/biome check ./src

format:
	npx @biomejs/biome format --write ./src

typecheck:
	npx tsc --noEmit

clean:
	rm -rf .next

# ========================
# Supabase Commands
# ========================
supabase-start:
	npx supabase start

supabase-stop:
	npx supabase stop

supabase-status:
	npx supabase status

supabase-reset:
	npx supabase db reset

# ========================
# Database Commands
# ========================
db-types:
	npx supabase gen types typescript --local > src/types/database.types.ts
	@echo "✅ Types generated at src/types/database.types.ts"

db-push:
	npx supabase db push

db-migrate:
ifndef name
	$(error Usage: make db-migrate name=<migration_name>)
endif
	npx supabase migration new $(name)

db-studio:
	open http://127.0.0.1:54323

db-diff:
	npx supabase db diff

# ========================
# Stripe Commands
# ========================
stripe-listen:
	stripe listen --forward-to localhost:3000/api/webhooks/stripe

# ========================
# All in One Commands
# ========================
setup: install supabase-start db-types
	@echo "✅ Setup complete!"

up: supabase-start dev
