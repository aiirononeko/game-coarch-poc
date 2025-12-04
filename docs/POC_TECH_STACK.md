# PoC 技術スタック定義

本書は、ゲームコーチングプラットフォームPoCの技術スタックとアーキテクチャの選定を定義します。

## 1. コアフレームワーク
- **Next.js (最新版)**
  - **アーキテクチャ**: App Router
  - **言語**: TypeScript
  - **データフェッチ**: Server Components & Server Actions
  - **スタイリング**: Tailwind CSS + shadcn/ui

## 2. バックエンド & データベース (BaaS)
- **Supabase**
  - **データベース**: PostgreSQL
  - **認証**: Supabase Auth (メール/パスワード、必要に応じてソーシャル認証)
  - **セキュリティ**: Row Level Security (RLS) ポリシー
  - **リアルタイム**: (PoCでは任意)

## 3. 決済インフラ
- **Stripe Connect**
  - **アカウントタイプ**: **Express**
    - *注*: 月額費用はかかりますが、より良いユーザー体験とプラットフォーム制御のために選択しました。
  - **フロー**:
    - コーチはオンボーディングフローを通じてStripeアカウントを連携。
    - 生徒は Stripe Checkout / Payment Elements を通じて支払い。
    - プラットフォームは手数料 (アプリケーションフィー) を徴収し、残りをコーチへ送金。

## 4. インフラ & デプロイ
- **Vercel**
  - **ホスティング**: Next.jsのためのゼロコンフィグデプロイ
  - **環境**: 本番 (Production) & プレビュー (Preview) 環境
  - **CI/CD**: GitHubからの自動デプロイ

## 5. 開発ツール
- **パッケージマネージャー**: pnpm
- **バージョン管理**: GitHub
- **リンター/フォーマッター**: Biome
