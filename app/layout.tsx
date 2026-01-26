import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ゲーム発明会 - 新しいゲームを発明しよう",
  description: "既存のゲームに＋１の工夫を加えた独創的なゲームを作って共有するコミュニティ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
