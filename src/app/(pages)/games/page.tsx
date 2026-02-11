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

      <div className="container mx-auto px-3 py-10 min-h-screen">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-black text-[#8b4513] mb-6 text-center drop-shadow-[2px_2px_0_#fff]" style={{ textShadow: '2px 2px 0 #fff, 4px 4px 0 #000' }}>
          ゲーム一覧
        </h2>

        {/* Search & Filter */}
        <div className="mb-10 max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="mb-5">
            <input
              type="text"
              placeholder="ゲームを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 bg-white border-[3px] border-black text-[#331100] text-base focus:outline-none focus:border-[#8b4513] transition-colors shadow-[3px_3px_0_#000]"
            />
          </div>


          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => {
              const isSelected = selectedTags.includes(tag.name);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.name)}
                  className={`pixel-button px-3 py-1.5 font-bold transition-all border-[3px] ${
                    isSelected
                      ? '!bg-[#e45c10] !text-white translate-x-[1.5px] translate-y-[1.5px] !shadow-none !border-black'
                      : '!bg-white !text-black hover:!bg-gray-100 shadow-[3px_3px_0_#000] !border-black'
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
          <div className="text-center py-16">
            <div className="mb-3 animate-float"><Twemoji emoji="⏳" size={51} /></div>
            <p className="text-xl text-[#331100]">読み込み中...</p>
          </div>
        ) : (
          <>
            {/* Games Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {games.length === 0 && (
              <div className="text-center py-16">
                <div className="mb-3"><Twemoji emoji="🔍" size={51} /></div>
                <p className="text-xl text-[#331100]">ゲームが見つかりませんでした</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
