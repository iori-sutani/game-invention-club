'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { GameCard } from '@/components/GameCard';
import { Twemoji } from '@/components/Twemoji';
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
    <div className="font-pixel text-[#331100]">

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
            <div className="mb-4 animate-float"><Twemoji emoji="⏳" size={64} /></div>
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
                <div className="mb-4"><Twemoji emoji="🔍" size={64} /></div>
                <p className="text-2xl text-[#331100]">ゲームが見つかりませんでした</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
