-- もしまだなら（pgcrypto拡張で gen_random_uuid を使う）
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 一覧・詳細で使うタイトル
  title text NOT NULL,

  -- Supabase Storage 上のパス
  -- 例: 'videos/2025/11/13/abcd-efgh.mp4'
  storage_path text NOT NULL,

  -- 再生用URL（publicURL or サイン付きURLをキャッシュする場合）
  playback_url text,

  -- 秒数（あとでフロントで mm:ss に整形）
  duration_seconds integer,

  -- レコード作成日時
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 一覧取得を created_at 降順にする想定なので index を貼っておく
CREATE INDEX videos_created_at_idx ON public.videos (created_at DESC);
