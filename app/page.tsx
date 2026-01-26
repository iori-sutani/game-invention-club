'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen font-pixel text-[#331100]">
      {/* Header */}
      <header className="border-b-4 border-black bg-[#8b4513] sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-[#fbad08] border-4 border-black flex items-center justify-center shadow-[4px_4px_0_#000]">
              <span className="text-2xl">🎮</span>
            </div>
            <h1 className="text-xl md:text-3xl font-bold text-white tracking-widest drop-shadow-[2px_2px_0_#900] group-hover:text-[#fbad08] transition-colors">
              ゲーム発明会
            </h1>
          </Link>
          
          <div className="flex gap-4">
            <Link href="/games" className="pixel-button px-4 md:px-6 py-2 md:py-3 bg-[#fbad08] text-white hover:bg-yellow-300 no-underline shadow-[4px_4px_0_#000]">
              一覧
            </Link>
            <Link href="/submit" className="pixel-button px-4 md:px-6 py-2 md:py-3 bg-[#fbad08] text-black hover:bg-yellow-300 no-underline shadow-[4px_4px_0_#000]">
              投稿
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 opacity-10" 
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        ></div>

        <div className="text-center mb-16 relative z-10">
          <div className="inline-block mb-8 animate-float">
            <div className="w-32 h-32 mx-auto bg-[#e45c10] border-4 border-black flex items-center justify-center shadow-[8px_8px_0_#000]">
              <span className="text-6xl drop-shadow-md">💡</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-[#8b4513] mb-6 leading-tight drop-shadow-[4px_4px_0_#fff] stroke-black" style={{ textShadow: '4px 4px 0 #fff, 6px 6px 0 #000' }}>
            新しいゲームを<br />発明しよう
          </h2>
          
          <div className="nes-container inline-block max-w-3xl mx-auto transform -rotate-1">
            <p className="text-xl md:text-2xl text-[#331100] leading-relaxed">
              既存のゲームに＋１の工夫を加えた<br />
              独創的なゲームを作って共有するコミュニティ
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
          <FeatureCard
            icon="🎨"
            title="創造性"
            description="あなたの独創的なアイデアを形に。今までにない体験を生み出そう"
          />
          <FeatureCard
            icon="⚙️"
            title="技術共有"
            description="実装の工夫をGitHubとQiitaで共有。学びながら成長"
          />
          <FeatureCard
            icon="🏆"
            title="コミュニティ"
            description="同じ志を持つ開発者とつながり、フィードバックし合おう"
          />
        </div>

        {/* CTA */}
        <div className="mt-20 text-center relative z-10">
          <div className="mb-4 text-[#e45c10] font-bold text-xl animate-blink">
             ▶ PRESS START
          </div>
          <Link 
            href="/games"
            className="inline-block pixel-button px-16 py-6 bg-[#8b4513] border-4 border-black text-white text-2xl font-bold tracking-wider transform hover:scale-105 shadow-[6px_6px_0_#000] hover:bg-[#5e300d]"
          >
            ゲームを見る 
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y-4 border-black bg-[#e45c10] py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="42" label="投稿作品" />
            <StatCard number="128" label="開発者" />
            <StatCard number="15" label="技術タグ" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#8b4513] border-t-4 border-black py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-sm font-pixel drop-shadow-[2px_2px_0_#000]">
            © 2025 ゲーム発明会 - GAME INVENTION CLUB
          </p>
        </div>
      </footer>
    </div>
  );
}
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="nes-container h-full transition-transform hover:-translate-y-2 hover:rotate-1">
      <div className="text-5xl mb-4 text-center">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-center border-b-4 border-black pb-2 text-[#8b4513]">{title}</h3>
      <p className="leading-relaxed mt-4 text-[#331100]">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-[#c46237] border-4 border-black p-8 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
      <div className="text-5xl font-bold text-white mb-2 drop-shadow-[4px_4px_0_#000]">
        {number}
      </div>
      <div className="text-[#fbad08] text-xl font-bold drop-shadow-[2px_2px_0_#000]">{label}</div>
    </div>
  );
}
