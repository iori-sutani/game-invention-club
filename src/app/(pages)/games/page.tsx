'use client';

import { useState } from 'react';
import Header from '@/components/Header';

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
    <div className="min-h-screen font-pixel text-[#331100]">

      <Header />

      <div className="container mx-auto px-4 py-12 min-h-screen">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-black text-[#8b4513] mb-8 text-center drop-shadow-[3px_3px_0_#fff]" style={{ textShadow: '3px 3px 0 #fff, 5px 5px 0 #000' }}>
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
              className="w-full px-6 py-4 bg-white border-4 border-black text-[#331100] text-lg focus:outline-none focus:border-[#8b4513] transition-colors shadow-[4px_4px_0_#000]"
            />
          </div>


          {/* Tag Filter */}
          <div className="flex flex-wrap gap-3">
            {allTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`pixel-button px-4 py-2 font-bold transition-all border-4 ${
                    isSelected
                      ? '!bg-[#e45c10] !text-white translate-x-[2px] translate-y-[2px] !shadow-none !border-black'
                      : '!bg-white !text-black hover:!bg-gray-100 shadow-[4px_4px_0_#000] !border-black'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
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
            <div className="text-6xl mb-4 pixelated">🔍</div>
            <p className="text-2xl text-[#331100]">ゲームが見つかりませんでした</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GameCard({ game }: { game: typeof dummyGames[0] }) {
  return (
    <div className="group h-full">
      <div className="nes-container h-full transition-transform group-hover:-translate-y-2 !p-0 overflow-hidden bg-white">
        {/* Screenshot */}
        <div className="aspect-video bg-[#f8dcb4] flex items-center justify-center border-b-4 border-black relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
          {/* Scanline decoration for cards */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }}></div>
          <span className="text-8xl relative z-10 drop-shadow-md pixelated">{game.screenshot}</span>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#8b4513] mb-2 group-hover:text-[#c46237] transition-colors">
            {game.title}
          </h3>
          <p className="text-[#331100] mb-4 line-clamp-2 text-sm">
            {game.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {game.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-[#331100] text-xs border-2 border-black"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Author & Likes */}
          <div className="flex items-center justify-between mb-4 text-[#c46237] text-sm font-bold">
            <span>by {game.author}</span>
            <span className="flex items-center gap-1 text-[#e45c10]">
              <span className="pixelated">❤️</span> {game.likes}
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-2">
            <a
              href={game.vercelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 pixel-button px-4 py-2 bg-[#fbad08] hover:bg-[#8b4513] text-black text-center font-bold transition-all shadow-[2px_2px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              プレイ
            </a>
            {game.githubUrl && (
              <a
                href={game.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-button pixelated px-4 py-2 bg-[#333] hover:bg-[#8b4513] text-white font-bold transition-all shadow-[2px_2px_0_#000]"
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
                className="pixel-button pixelated px-4 py-2 bg-[#8b4513] hover:bg-[#8b4513]  text-white font-bold transition-all shadow-[2px_2px_0_#000]"
                title="Qiita"
              >
                  📝
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
