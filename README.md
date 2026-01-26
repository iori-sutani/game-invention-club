# 🎮 ゲーム発明会

既存のゲームに＋１の工夫を加えた独創的なゲームを作って共有するコミュニティプラットフォーム

## 🌟 コンセプト

- **創造性**: 今までにないゲーム体験を生み出す
- **技術共有**: GitHubとQiitaで実装を共有し、学び合う
- **コミュニティ**: 同じ志を持つ開発者とつながる

## 🎨 デザイン

ドット調・レトロゲーム風のピクセルアートデザイン

- ピクセルフォント (Press Start 2P)
- 8bit/16bit時代を彷彿とさせるカラーパレット
- CRTスキャンラインエフェクト
- ドット絵風のUI要素

## 📦 技術スタック

- **フロントエンド**: Next.js 15 + React 19
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript
- **フォント**: Press Start 2P (Google Fonts)

## 🚀 セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番環境での起動
npm start
```

開発サーバーは [http://localhost:3000](http://localhost:3000) で起動します。

## 📂 プロジェクト構成

```
game-invention-club/
├── app/
│   ├── page.tsx          # ホーム画面 (LP)
│   ├── games/
│   │   └── page.tsx      # ゲーム一覧
│   ├── submit/
│   │   └── page.tsx      # 投稿フォーム
│   ├── layout.tsx        # ルートレイアウト
│   └── globals.css       # グローバルスタイル
├── public/               # 静的ファイル
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🎯 機能 (MVP)

### 実装済み
- ✅ ホーム画面 (LP風)
- ✅ ゲーム一覧
- ✅ 投稿フォーム
- ✅ 検索・フィルタリング
- ✅ タグシステム
- ✅ レスポンシブデザイン

### 今後の実装予定
- [ ] バックエンド (Supabase/Firebase)
- [ ] ユーザー認証 (GitHub OAuth)
- [ ] コメント機能
- [ ] いいね機能
- [ ] ユーザープロフィール
- [ ] コンテスト機能

## 🎮 投稿ガイドライン

1. 既存ゲームのコピーではなく、独自の工夫があること
2. GitHubでソースコードを公開すること
3. 技術的な解説があると他の開発者の学びになります
4. 楽しく、クリエイティブな作品をお待ちしています!

## 📝 ライセンス

MIT

## 👨‍💻 開発者

Iori - [@your-github](https://github.com/your-github)
