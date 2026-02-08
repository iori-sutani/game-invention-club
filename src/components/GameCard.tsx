'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { GameWithDetails } from '@/types/database';

interface GameCardProps {
  game: GameWithDetails;
}

export default function GameCard({ game }: GameCardProps) {
  const [isLiked, setIsLiked] = useState(game.is_liked ?? false);
  const [likesCount, setLikesCount] = useState(game.likes_count);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;
    setIsLoading(true);

    // Optimistic update
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      const res = await fetch(`/api/games/${game.id}/like`, {
        method: wasLiked ? 'DELETE' : 'POST',
      });

      if (!res.ok) {
        // Revert on error
        setIsLiked(wasLiked);
        setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);

        if (res.status === 401) {
          alert('いいねするにはログインが必要です');
        }
      } else {
        const data = await res.json();
        setLikesCount(data.likes_count);
      }
    } catch {
      // Revert on error
      setIsLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
    } finally {
      setIsLoading(false);
    }
  };

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
            <Link
              href={`/users/${game.user.id}`}
              className="hover:text-[#8b4513] hover:underline transition-colors"
            >
              by {game.user.username}
            </Link>
            <button
              onClick={handleLike}
              disabled={isLoading}
              className={`flex items-center gap-1 transition-all ${
                isLiked
                  ? 'text-[#e45c10] scale-110'
                  : 'text-gray-400 hover:text-[#e45c10] hover:scale-105'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              title={isLiked ? 'いいねを取り消す' : 'いいねする'}
            >
              <span className="pixelated">{isLiked ? '❤️' : '🤍'}</span> {likesCount}
            </button>
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
