🎮 ゲーム動画コーチングPoC 概要

🎯 目的

コーチングを受けるプレイヤーが自分のプレイ動画をアップロードし、再生中に学びをメモ（付箋）として残せるWebサービスのPoC。
まずは「自分専用」で動く最小構成を実装し、UXとデータ構造を検証する。

⸻

🧩 技術構成
	•	フレームワーク：Next.js 16（App Router, Server Actions）
	•	ホスティング：Vercel
	•	バックエンド/BaaS：Supabase
	•	Postgres（動画・付箋の管理）
	•	Storage（動画ファイルの保存）
	•	Authは未使用（自分専用運用）
	•	UIコンポーネント：shadcn/ui + Tailwind CSS
	•	形式：MP4（H.264/AAC）

⸻

🧱 主要機能
	1.	動画アップロード
	•	Supabase Storage にファイルを保存
	•	公開URLをDBに登録
	2.	動画一覧
	•	登録済みの動画を一覧表示（タイトル＋登録日時）
	3.	動画詳細 / 再生画面
	•	<video> で再生
	•	タイムラインバーに付箋マーカーを表示
	•	クリックで付箋追加（再生位置を記録）
	•	ホバーで付箋内容のツールチップ表示
	•	右カラムで付箋リスト表示・削除・追記

⸻

🧮 データモデル

videos

カラム名	型	説明
id	UUID	主キー
title	text	動画タイトル
storage_path	text	Supabase上のファイルパス
playback_url	text	再生URL（publicURL）
duration_seconds	int	動画長（秒）
created_at	timestamptz	登録日時

timeline_markers

カラム名	型	説明
id	UUID	主キー
video_id	UUID	対応する動画ID
t_seconds	int	動画上の秒数位置
label	text	付箋タイトル
note	text	付箋本文
color	text	表示色（デフォルト: yellow）
created_at	timestamptz	作成日時


⸻

🧭 画面構成

/upload
	•	動画アップロードフォーム（タイトル＋ファイル選択）
	•	アップロード完了後にDB登録 → /へリダイレクト

/
	•	動画一覧
	•	各カードをクリックで詳細へ遷移

/videos/[id]
	•	動画再生プレイヤー
	•	タイムライン上にマーカー（付箋）表示
	•	クリックで新規付箋追加
	•	右側に付箋一覧（削除・編集）

⸻

⚙️ 想定フロー
	1.	/upload で動画を登録
	2.	/ に一覧表示される
	3.	/videos/[id] で再生しながらタイムラインに付箋を追加
	4.	ページを再読み込みしても付箋が保持されていることを確認

⸻

🧱 PoCの目的と検証項目
	•	UI操作感（付箋の追加・再生との連動）
	•	Supabaseのパフォーマンスと動画URL処理
	•	将来の拡張性（複数ユーザー化、署名URL化、Mux対応）

⸻

🪜 次のステップ候補
	•	Supabase Authによるマルチユーザー対応
	•	付箋にフレームサムネイルを付与
	•	HLS配信（Mux/Cloudflare Stream）への移行
	•	コーチとプレイヤー間のコメント機能追加

⸻

このPoCで**「アップロード→再生→付箋追加」までの最小体験**を実装し、UXと技術的実現性を確かめる。
