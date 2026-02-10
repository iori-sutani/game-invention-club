import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  // - Next.js推奨のルールセット（next/recommended）を含む
  // - Core Web Vitals（LCP、FID、CLS）に影響するコードパターンを警告
  // - 含まれる主なルール:
  //   - @next/next/no-html-link-for-pages — <a>タグではなくnext/linkを使用
  //   - @next/next/no-img-element — <img>ではなくnext/imageを推奨
  //   - @next/next/no-sync-scripts — 同期スクリプトの禁止
  //   - react/no-unescaped-entities — JSX内の特殊文字エスケープ
  //   - react-hooks/rules-of-hooks — Hooksのルール遵守
  //   - react-hooks/exhaustive-deps — useEffect依存配列の完全性
  ...coreWebVitals,
  // - TypeScript向けのルールを追加
  // - @typescript-eslint/no-unused-vars — 未使用変数の警告
  // - @typescript-eslint/no-explicit-any — any型の使用警告
  // - TypeScript固有のベストプラクティス
  ...typescript,
];

export default eslintConfig;
