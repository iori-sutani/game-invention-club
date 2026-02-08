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
  title: "ゲーム発明会",
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
        {/* SVG Filter for pixelation effect on vector elements/emojis */}
        <svg style={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
          <filter id="pixelate" x="0" y="0">
            <feFlood x="2" y="2" height="2" width="2" />
            <feComposite width="4" height="4" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius="2" />
          </filter>
        </svg>

        {/* 背景テクスチャ (全体に適用、最背面) */}
        <div className="fixed inset-0 z-[-1] pixel-pattern-bg"></div>
        <div className="fixed inset-0 z-[-1] scanlines-bg pointer-events-none"></div>
        {children}
      </body>
    </html>
  );
}
