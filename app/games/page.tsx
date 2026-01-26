'use client';

import Link from 'next/link';
import { useState } from 'react';

// ダミーデータ
const dummyGames = [
  {
    id: 1,
    title: '顔面ハンマー投げ',
    description: '顔認識を使った新感覚スポーツゲーム。あなたの表情でハンマーを投げろ!',
    author: 'Iori',
    screenshot: '🎯',
    tags: ['React', '顔認識', 'WebGL'],
    likes: 156,
    vercelUrl: 'https://example.vercel.app',
    githubUrl: 'https://github.com/example/hammer-throw',
    qiitaUrl: 'https://qiita.com/example/items/123'
  },
  {
    id: 2,
    title: 'タイピング vs ゾンビ',
    description: 'タイピングで敵を倒す防衛ゲーム。速く正確に打つほど強力な攻撃に!',
    author: 'GameDev',
    screenshot: '⌨️',
    tags: ['TypeScript', 'Phaser', 'WebSocket'],
    likes: 89,
    vercelUrl: 'https://example.vercel.app',
    githubUrl: 'https://github.com/example/typing-zombie',
    qiitaUrl: 'https://qiita.com/example/items/456'
  },
  {
    id: 3,
    title: 'リズム料理シミュレーター',
    description: '音楽に合わせて料理を作る新ジャンル。リズムゲーム×料理ゲーム',
    author: 'CookMaster',
    screenshot: '🍳',
    tags: ['Vue.js', 'Web Audio API', 'Canvas'],
    likes: 124,
    vercelUrl: 'https://example.vercel.app',
    githubUrl: 'https://github.com/example/rhythm-cooking',
    qiitaUrl: 'https://qiita.com/example/items/789'
  },
  {
    id: 4,
    title: '重力反転パズル',
    description: '重力の向きを変えながらゴールを目指すパズルゲーム',
    author: 'PhysicsLover',
    screenshot: '🌍',
    tags: ['React', 'Matter.js', 'Redux'],
    likes: 67,
    vercelUrl: 'https://example.vercel.app',
    githubUrl: 'https://github.com/example/gravity-puzzle'
  },
  {
    id: 5,
    title: '声でジャンプ',
    description: 'マイクの音量でキャラクターがジャンプ。声の大きさが高さに!',
    author: 'SoundGamer',
    screenshot: '🎤',
    tags: ['Next.js', 'Web Audio API', 'Tailwind'],
    likes: 203,
    vercelUrl: 'https://example.vercel.app',
    githubUrl: 'https://github.com/example/voice-jump',
    qiitaUrl: 'https://qiita.com/example/items/abc'
  },
  {
    id: 6,
    title: 'お絵描き対戦',
    description: 'リアルタイムで絵を描いて対戦。AIが絵を判定してバトル',
    author: 'ArtCoder',
    screenshot: '🎨',
    tags: ['Angular', 'TensorFlow.js', 'WebSocket'],
    likes: 145,
    vercelUrl: 'https://example.vercel.app',
    githubUrl: 'https://github.com/example/drawing-battle'
  }
];

const allTags = Array.from(new Set(dummyGames.flatMap(game => game.tags)));

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredGames = dummyGames.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => game.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Scanline effect */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-5 bg-repeat" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
      }}></div>

      {/* Header */}
      <header className="border-b-4 border-cyan-400 bg-slate-900/90 backdrop-blur-sm sticky top-0 z-40">
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
            <Link href="/games" className="pixel-button px-6 py-3 bg-purple-600 text-white font-bold pixel-text tracking-wider">
              一覧
            </Link>
            <Link href="/submit" className="pixel-button px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold pixel-text tracking-wider transition-all">
              投稿
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Title */}
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 pixel-text mb-8 text-center">
          ゲーム一覧
        </h2>

        {/* Search & Filter */}
        <div className="mb-12 max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="ゲームを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-slate-800 border-4 border-cyan-400 text-cyan-100 pixel-text text-lg focus:outline-none focus:border-purple-400 transition-colors pixel-corners"
            />
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-3">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`pixel-button px-4 py-2 pixel-text font-bold transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl text-purple-300 pixel-text">ゲームが見つかりませんでした</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GameCard({ game }: { game: typeof dummyGames[0] }) {
  return (
    <div className="group">
      <div className="pixel-corners bg-gradient-to-br from-cyan-600 to-purple-600 p-1 transition-all group-hover:scale-105 group-hover:shadow-2xl">
        <div className="pixel-corners bg-slate-900 h-full">
          {/* Screenshot */}
          <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border-b-4 border-cyan-400">
            <span className="text-8xl">{game.screenshot}</span>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-2xl font-bold text-cyan-400 pixel-text mb-2 group-hover:text-purple-400 transition-colors">
              {game.title}
            </h3>
            
            <p className="text-purple-300 pixel-text mb-4 line-clamp-2">
              {game.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {game.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-800 text-cyan-400 pixel-text text-sm border-2 border-cyan-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Author & Likes */}
            <div className="flex items-center justify-between mb-4 text-purple-300 pixel-text">
              <span>by {game.author}</span>
              <span className="flex items-center gap-1">
                ❤️ {game.likes}
              </span>
            </div>

            {/* Links */}
            <div className="flex gap-2">
              <a
                href={game.vercelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 pixel-button px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-center pixel-text font-bold transition-all"
              >
                プレイ
              </a>
              {game.githubUrl && (
                <a
                  href={game.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-button px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 pixel-text font-bold transition-all"
                  title="GitHub"
                >
                  📦
                </a>
              )}
              {game.qiitaUrl && (
                <a
                  href={game.qiitaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-button px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 pixel-text font-bold transition-all"
                  title="Qiita"
                >
                  📝
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
