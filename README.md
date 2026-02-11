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

これにより以下が作成される:
- テーブル (`users`, `games`, `tags`, `game_tags`, `likes`)
- RLSポリシー
- トリガー (updated_at, tag usage count)
- Storageバケット (`screenshots`) とポリシー

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
├── src/
│   ├── app/
│   │   ├── (pages)/                        # Route Group (URLに影響なし)
│   │   │   ├── games/page.tsx              # ゲーム一覧ページ
│   │   │   ├── submit/page.tsx             # 投稿フォームページ (ログインゲート付き)
│   │   │   └── users/[id]/page.tsx         # ユーザープロフィールページ
│   │   ├── api/
│   │   │   ├── auth/callback/route.ts      # GitHub OAuth コールバック
│   │   │   ├── games/
│   │   │   │   ├── route.ts                # GET/POST ゲーム一覧・作成
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts            # GET/PUT/DELETE ゲーム個別操作
│   │   │   │       └── like/route.ts       # POST/DELETE いいね
│   │   │   ├── tags/route.ts               # GET タグ一覧
│   │   │   └── users/
│   │   │       ├── me/route.ts             # GET ログインユーザー情報
│   │   │       └── [id]/
│   │   │           ├── route.ts            # GET ユーザープロフィール
│   │   │           └── games/route.ts      # GET ユーザーのゲーム一覧
│   │   ├── page.tsx                        # ホーム画面
│   │   ├── layout.tsx                      # ルートレイアウト
│   │   └── globals.css                     # グローバルスタイル
│   ├── components/
│   │   ├── Header.tsx                      # 共通ヘッダー (ナビ + 認証UI)
│   │   └── GameCard.tsx                    # ゲームカード (いいねボタン付き)
│   ├── lib/
│   │   ├── db/
│   │   │   ├── client.ts                   # ブラウザ用Supabaseクライアント
│   │   │   ├── server.ts                   # サーバー用Supabaseクライアント
│   │   │   └── middleware.ts               # セッション管理
│   │   └── repositories/
│   │       ├── index.ts                    # ファクトリ関数 (createRepositories)
│   │       ├── interfaces.ts               # リポジトリインターフェース定義
│   │       └── impl/                       # Supabase固有の実装
│   │           ├── auth.ts                 # IAuthRepository実装
│   │           ├── users.ts                # IUserRepository実装
│   │           ├── games.ts                # IGameRepository実装
│   │           ├── tags.ts                 # ITagRepository実装
│   │           └── likes.ts                # ILikeRepository実装
│   ├── types/
│   │   └── database.ts                     # Supabase型定義
│   └── proxy.ts                            # Next.jsミドルウェア (セッション更新)
├── supabase/migrations/
│   └── 001_initial_schema.sql              # DBスキーマ (テーブル・RLS・Storage全部入り)
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

`@/` パスエイリアスは `src/` を指します。

## データベース構成

| テーブル    | 説明                                 |
| ----------- | ------------------------------------ |
| `users`     | ユーザー情報 (GitHub連携)            |
| `games`     | 投稿されたゲーム                     |
| `tags`      | タグマスタ (usage_countトリガー付き) |
| `game_tags` | ゲームとタグの中間テーブル           |
| `likes`     | いいね (ユーザー×ゲームでユニーク)   |

RLS (Row Level Security) により、ゲームの編集・削除は投稿者のみに制限される。

## リポジトリパターン

APIルートはリポジトリパターンを採用し、データアクセスをSupabaseから分離している。

- **インターフェース** (`lib/repositories/interfaces.ts`): `IAuthRepository`, `IUserRepository`, `IGameRepository`, `ITagRepository`, `ILikeRepository`
- **実装** (`lib/repositories/impl/`): 各リポジトリのSupabase固有実装
- **ファクトリ** (`lib/repositories/index.ts`): `createRepositories()` で全リポジトリを生成

APIルートでの使用例:

```typescript
const { auth, users, games } = await createRepositories();
const { user } = await auth.getUser();
```

新しいデータアクセスを追加する場合は、まずインターフェースにメソッドを追加し、その後 `impl/` で実装する。

## 開発状況

進捗や今後の予定は [GitHub Issues](https://github.com/iori-sutani/game-invention-club/issues) で管理しています。

## 投稿ガイドライン

1. 既存ゲームのコピーではなく、独自の工夫があること
2. GitHubでソースコードを公開すること
3. 技術的な解説があると他の開発者の学びになります
4. 楽しく、クリエイティブな作品をお待ちしています!

## ライセンス

MIT
