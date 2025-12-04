# 画面設計書 (Screen Design)

本ドキュメントは、PoCにおけるアプリケーションの画面構成、パス、および主要な機能を定義します。

## 1. 共通 / 認証 (Common / Auth)

| 画面名 | パス | 概要 | 主要要素・アクション |
| --- | --- | --- | --- |
| **トップページ / ログイン** | `/` | アプリケーションの入り口。未ログイン時はログインを促す。 | ・サービスロゴ/説明<br>・ログインフォーム<br>・新規登録リンク |
| **アカウント登録** | `/register` | 新規ユーザー登録画面。 | ・メールアドレス/パスワード入力<br>・ロール選択 (生徒/コーチ)<br>・登録ボタン |
| **メール確認待ち** | `/register/confirm` | 認証メール送信完了を通知する画面。 | ・認証メール送信メッセージ<br>・メール確認のお願い<br>・ログインページへのリンク |
| **認証コールバック** | `/auth/callback` | Supabase Authのリダイレクト先 (画面としては意識しない)。 | ・セッション確立処理<br>・プロフィール作成<br>・ロールに応じたリダイレクト (コーチor生徒) |


## 2. コーチ向け画面 (Coach Views)

コーチ (`role: 'coach'`) が利用する画面群です。

| 画面名 | パス | 概要 | 主要要素・アクション |
| --- | --- | --- | --- |
| **コーチダッシュボード** | `/coach/dashboard` | コーチのホーム画面。売上や予約状況を概観する。 | ・今月の売上概算<br>・直近の予約リスト<br>・「Stripe連携」ステータス/ボタン |
| **プロフィール設定** | `/coach/settings` | 自身のプロフィールとStripe連携状態を管理する。 | ・プロフィール編集 (名前, Bio, アバター)<br>・Stripe Connect連携ボタン (未連携時)<br>・Stripeダッシュボードへのリンク (連携済時) |
| **プラン管理** | `/coach/plans` | 販売するコーチングプランの一覧と作成・編集。 | ・プラン一覧表示<br>・「新規プラン作成」ボタン<br>・プラン編集/削除アクション |
| **予約管理** | `/coach/bookings` | 生徒からの予約一覧を確認する。 | ・予約リスト (ステータス別)<br>・予約詳細確認 |

## 3. 生徒向け画面 (Student Views)

生徒 (`role: 'student'`) が利用する画面群です。

| 画面名 | パス | 概要 | 主要要素・アクション |
| --- | --- | --- | --- |
| **コーチ一覧 (トップ)** | `/coaches` | 登録されているコーチの一覧を表示する (PoCでは実質1名)。 | ・コーチカード一覧 (名前, Bio, アバター)<br>・詳細ページへのリンク |
| **コーチ詳細 / プラン選択** | `/coaches/[id]` | 特定のコーチの詳細情報と、提供プランを表示する。 | ・コーチプロフィール詳細<br>・プラン一覧<br>・「予約する」ボタン (各プラン) |
| **予約・決済画面** | `/bookings/new` | 選択したプランの確認と支払いを行う。 | ・選択プラン情報 (タイトル, 金額)<br>・Stripe Payment Element (カード入力)<br>・「支払う」ボタン |
| **マイページ / 予約履歴** | `/student/bookings` | 自身の予約履歴を確認する。 | ・過去/現在の予約リスト<br>・ステータス確認 (支払済, 完了など) |

## 4. Stripe関連 (Stripe Related)

Stripe Connectのフローで使用されるシステム画面です。

| 画面名 | パス | 概要 | 主要要素・アクション |
| --- | --- | --- | --- |
| **連携リターン** | `/stripe/return` | Stripeオンボーディング完了後の戻り先。 | ・連携成功メッセージ<br>・ダッシュボードへのリダイレクト |
| **連携リフレッシュ** | `/stripe/refresh` | Stripeオンボーディング中断/失敗時の戻り先。 | ・再試行ボタン<br>・エラーメッセージ |

## 5. 画面遷移図 (簡易)

```mermaid
graph TD
    root["/ (Top/Login)"] -->|Login as Coach| c_dash["/coach/dashboard"]
    root -->|Login as Student| s_list["/coaches"]
    root -->|Register| reg["/register"]
    reg -->|Submit| confirm["/register/confirm"]
    confirm -.->|Email Link| callback["/auth/callback"]
    callback -->|Coach| c_dash
    callback -->|Student| s_hist

    subgraph Coach
        c_dash --> c_settings["/coach/settings"]
        c_dash --> c_plans["/coach/plans"]
        c_dash --> c_bookings["/coach/bookings"]
        c_settings -->|Stripe Connect| stripe_host["Stripe Hosted Page"]
        stripe_host -->|Success| stripe_ret["/stripe/return"]
        stripe_ret --> c_dash
    end

    subgraph Student
        s_list -->|Select Coach| s_detail["/coaches/[id]"]
        s_detail -->|Select Plan| s_book["/bookings/new"]
        s_book -->|Pay| s_hist["/student/bookings"]
    end
```
