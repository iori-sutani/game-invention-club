import type { Metadata } from "next";
import { DotGothic16, Press_Start_2P } from "next/font/google"; // Import fonts
import "./globals.css";

const dotGothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dot-gothic",
});

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

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
      <body className={`${dotGothic.variable} ${pressStart.variable} relative font-pixel`}>
        {/* 背景テクスチャ (全体に適用、最背面) */}
        <div className="fixed inset-0 z-[-1] pixel-pattern-bg"></div>
        <div className="fixed inset-0 z-[-1] scanlines-bg pointer-events-none"></div>
        {children}
      </body>
    </html>
  );
}
