# ゲーム発明会

既存のゲームに＋１の工夫を加えた独創的なゲームを作って共有するコミュニティプラットフォーム

## コンセプト

- **創造性**: 今までにないゲーム体験を生み出す
- **技術共有**: GitHubとQiitaで実装を共有し、学び合う
- **コミュニティ**: 同じ志を持つ開発者とつながる

## デザイン

ドット調・レトロゲーム風のピクセルアートデザイン

- ピクセルフォント (Press Start 2P)
- 8bit/16bit時代を彷彿とさせるカラーパレット
- CRTスキャンラインエフェクト
- ドット絵風のUI要素

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router) + React 19
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL + Auth)
- **認証**: GitHub OAuth (Supabase Auth経由)
- **フォント**: Press Start 2P (Google Fonts)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example` を `.env.local` にコピーし、Supabaseの値を設定する。

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Supabaseのマイグレーション

Supabaseダッシュボードの SQL Editor、または Supabase CLI で `supabase/migrations/001_initial_schema.sql` を実行する。

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) で起動する。

### その他のコマンド

```bash
npm run build    # プロダクションビルド
npm start        # プロダクションサーバー起動
npm run lint     # Lint実行
```

## プロジェクト構成

```
game-invention-club/
├── app/
│   ├── api/
│   │   ├── auth/callback/route.ts      # GitHub OAuth コールバック
│   │   ├── games/
│   │   │   ├── route.ts                # GET/POST ゲーム一覧・作成
│   │   │   └── [id]/
│   │   │       ├── route.ts            # GET/PUT/DELETE ゲーム個別操作
│   │   │       └── like/route.ts       # POST/DELETE いいね
│   │   ├── tags/route.ts               # GET タグ一覧
│   │   └── users/
│   │       ├── me/route.ts             # GET ログインユーザー情報
│   │       └── [id]/
│   │           ├── route.ts            # GET ユーザープロフィール
│   │           └── games/route.ts      # GET ユーザーのゲーム一覧
│   ├── games/page.tsx                  # ゲーム一覧ページ
│   ├── submit/page.tsx                 # 投稿フォームページ (ログインゲート付き)
│   ├── page.tsx                        # ホーム画面
│   ├── layout.tsx                      # ルートレイアウト
│   └── globals.css                     # グローバルスタイル
├── components/
│   └── Header.tsx                      # 共通ヘッダー (ナビ + 認証UI)
├── lib/supabase/
│   ├── client.ts                       # ブラウザ用クライアント
│   ├── server.ts                       # サーバー用クライアント
│   └── middleware.ts                   # セッション管理
├── types/
│   └── database.ts                     # Supabase型定義
├── supabase/migrations/
│   └── 001_initial_schema.sql          # DBスキーマ
├── middleware.ts                        # Next.jsミドルウェア
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## データベース構成

| テーブル | 説明 |
|---------|------|
| `users` | ユーザー情報 (GitHub連携) |
| `games` | 投稿されたゲーム |
| `tags` | タグマスタ (usage_countトリガー付き) |
| `game_tags` | ゲームとタグの中間テーブル |
| `likes` | いいね (ユーザー×ゲームでユニーク) |

RLS (Row Level Security) により、ゲームの編集・削除は投稿者のみに制限される。

## 機能と進捗

### フロントエンド (UI)

- [x] ホーム画面
- [x] ゲーム一覧 (検索・タグフィルタリング)
- [x] 投稿フォーム (タグ選択付き)
- [x] レスポンシブデザイン
- [x] 共通ヘッダーコンポーネント
- [x] ログイン/ログアウトUI (GitHub OAuth)
- [x] 投稿ページのログインゲート
- [ ] いいねボタン
- [ ] ユーザープロフィールページ

### バックエンド (API)

- [x] ゲームCRUD (`/api/games`)
- [x] いいねAPI (`/api/games/[id]/like`)
- [x] タグAPI (`/api/tags`)
- [x] ユーザーAPI (`/api/users`)
- [x] GitHub OAuth コールバック (`/api/auth/callback`)
- [x] DBスキーマ・マイグレーション
- [x] RLS (Row Level Security)

### 未接続・未実装

- [ ] フロントエンドからAPIへの接続 (現在ダミーデータ使用)
- [ ] スクリーンショットのアップロード (Supabase Storage)
- [ ] ホーム画面の統計情報を実データ化
- [ ] コメント機能
- [ ] コンテスト機能

## 投稿ガイドライン

1. 既存ゲームのコピーではなく、独自の工夫があること
2. GitHubでソースコードを公開すること
3. 技術的な解説があると他の開発者の学びになります
4. 楽しく、クリエイティブな作品をお待ちしています!

## ライセンス

MIT
