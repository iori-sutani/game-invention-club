'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Scanline effect */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-5 bg-repeat" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
      }}></div>

      {/* Header */}
      <header className="border-b-4 border-cyan-400 bg-slate-900/90 backdrop-blur-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 relative pixel-corners">
              <div className="absolute inset-1 bg-slate-900 flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-cyan-400 pixel-text tracking-wider group-hover:text-purple-400 transition-colors">
              ゲーム発明会
            </h1>
          </Link>
          
          <div className="flex gap-4">
            <Link href="/games" className="pixel-button px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold pixel-text tracking-wider transition-all">
              一覧
            </Link>
            <Link href="/submit" className="pixel-button px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold pixel-text tracking-wider transition-all">
              投稿
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-block mb-8 animate-float">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 pixel-corners relative">
              <div className="absolute inset-2 bg-slate-900 flex items-center justify-center">
                <span className="text-6xl">💡</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 pixel-text mb-6 leading-tight">
            新しいゲームを<br />発明しよう
          </h2>
          
          <p className="text-xl md:text-2xl text-cyan-300 pixel-text max-w-3xl mx-auto leading-relaxed">
            既存のゲームに＋１の工夫を加えた<br />
            独創的なゲームを作って共有するコミュニティ
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
        <div className="mt-20 text-center">
          <Link 
            href="/games"
            className="inline-block pixel-button px-12 py-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-2xl font-bold pixel-text tracking-wider transition-all transform hover:scale-105"
          >
            ゲームを見る →
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y-4 border-cyan-400 bg-slate-800/50 backdrop-blur py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="42" label="投稿作品" />
            <StatCard number="128" label="開発者" />
            <StatCard number="15" label="技術タグ" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-purple-500 bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-cyan-400 pixel-text">
            © 2025 ゲーム発明会 - 新しいゲーム体験を創造する
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="group">
      <div className="pixel-corners bg-gradient-to-br from-purple-600 to-cyan-600 p-1 transition-all group-hover:scale-105">
        <div className="pixel-corners bg-slate-900 p-8 h-full">
          <div className="text-5xl mb-4">{icon}</div>
          <h3 className="text-2xl font-bold text-cyan-400 pixel-text mb-3">{title}</h3>
          <p className="text-purple-300 pixel-text leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="pixel-corners bg-slate-900 p-8 border-2 border-cyan-400">
      <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 pixel-text mb-2">
        {number}
      </div>
      <div className="text-xl text-purple-300 pixel-text">{label}</div>
    </div>
  );
}
