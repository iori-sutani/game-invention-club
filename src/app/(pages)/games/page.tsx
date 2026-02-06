'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import type { GameWithDetails, Tag } from '@/types/database';

export default function GamesPage() {
  const [games, setGames] = useState<GameWithDetails[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));

      const res = await fetch(`/api/games?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setGames(data);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedTags]);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetch('/api/tags');
      if (res.ok) {
        const data = await res.json();
        setAllTags(data);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
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
              const isSelected = selectedTags.includes(tag.name);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.name)}
                  className={`pixel-button px-4 py-2 font-bold transition-all border-4 ${
                    isSelected
                      ? '!bg-[#e45c10] !text-white translate-x-[2px] translate-y-[2px] !shadow-none !border-black'
                      : '!bg-white !text-black hover:!bg-gray-100 shadow-[4px_4px_0_#000] !border-black'
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 pixelated animate-float">⏳</div>
            <p className="text-2xl text-[#331100]">読み込み中...</p>
          </div>
        ) : (
          <>
            {/* Games Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {games.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {games.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4 pixelated">🔍</div>
                <p className="text-2xl text-[#331100]">ゲームが見つかりませんでした</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function GameCard({ game }: { game: GameWithDetails }) {
  return (
    <div className="group h-full">
      <div className="nes-container h-full transition-transform group-hover:-translate-y-2 !p-0 overflow-hidden bg-white">
        {/* Screenshot */}
        <div className="aspect-video bg-[#f8dcb4] flex items-center justify-center border-b-4 border-black relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
          {/* Scanline decoration for cards */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }}></div>
          {game.screenshot_url ? (
            <img
              src={game.screenshot_url}
              alt={game.title}
              className="w-full h-full object-cover relative z-10"
            />
          ) : (
            <span className="text-8xl relative z-10 drop-shadow-md pixelated">🎮</span>
          )}
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
                key={tag.id}
                className="px-2 py-1 bg-gray-100 text-[#331100] text-xs border-2 border-black"
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Author & Likes */}
          <div className="flex items-center justify-between mb-4 text-[#c46237] text-sm font-bold">
            <span>by {game.user.username}</span>
            <span className="flex items-center gap-1 text-[#e45c10]">
              <span className="pixelated">❤️</span> {game.likes_count}
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-2">
            <a
              href={game.vercel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 pixel-button px-4 py-2 bg-[#fbad08] hover:bg-[#8b4513] text-black text-center font-bold transition-all shadow-[2px_2px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              プレイ
            </a>
            {game.github_url && (
              <a
                href={game.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-button pixelated px-4 py-2 bg-[#333] hover:bg-[#8b4513] text-white font-bold transition-all shadow-[2px_2px_0_#000]"
                title="GitHub"
              >
                📦
              </a>
            )}
            {game.qiita_url && (
              <a
                href={game.qiita_url}
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
