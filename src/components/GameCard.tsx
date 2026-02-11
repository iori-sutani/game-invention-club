'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { GameWithDetails } from '@/types/database';
import { Twemoji } from '@/components/Twemoji';

interface GameCardProps {
  game: GameWithDetails;
}

export function GameCard({ game }: GameCardProps) {
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
      <div className="nes-container h-full transition-transform group-hover:-translate-y-1.5 !p-0 overflow-hidden bg-white">
        {/* Screenshot */}
        <div className="aspect-video bg-[#f8dcb4] flex items-center justify-center border-b-[3px] border-black relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
          {/* Scanline decoration for cards */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1.5px, #000 1.5px, #000 3px)' }}></div>
          {game.screenshot_url ? (
            <Image
              src={game.screenshot_url}
              alt={game.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover relative z-10"
            />
          ) : (
            <Twemoji emoji="🎮" size={77} className="relative z-10 drop-shadow-md" />
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-[#8b4513] mb-1.5 group-hover:text-[#c46237] transition-colors">
            {game.title}
          </h3>
          <p className="text-[#331100] mb-3 line-clamp-2 text-xs">
            {game.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {game.tags.map(tag => (
              <span
                key={tag.id}
                className="px-1.5 py-0.5 bg-gray-100 text-[#331100] text-xs border-[1.5px] border-black"
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Author & Likes */}
          <div className="flex items-center justify-between mb-3 text-[#c46237] text-xs font-bold">
            <Link
              href={`/users/${game.user.id}`}
              className="hover:text-[#8b4513] hover:underline transition-colors"
            >
              by {game.user.username}
            </Link>
            <button
              onClick={handleLike}
              disabled={isLoading}
              className={`flex items-center gap-0.5 transition-all ${
                isLiked
                  ? 'text-[#e45c10] scale-110'
                  : 'text-gray-400 hover:text-[#e45c10] hover:scale-105'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              title={isLiked ? 'いいねを取り消す' : 'いいねする'}
            >
              <Twemoji emoji={isLiked ? '❤️' : '🤍'} size={13} /> {likesCount}
            </button>
          </div>

          {/* Links */}
          <div className="flex gap-1.5">
            <a
              href={game.vercel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 pixel-button px-3 py-1.5 bg-[#fbad08] hover:bg-[#8b4513] text-black text-center font-bold transition-all shadow-[1.5px_1.5px_0_#000] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none"
            >
              プレイ
            </a>
            {game.github_url && (
              <a
                href={game.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-button px-3 py-1.5 bg-[#333] hover:bg-[#8b4513] text-white font-bold transition-all shadow-[1.5px_1.5px_0_#000]"
                title="GitHub"
              >
                <Twemoji emoji="📦" size={13} />
              </a>
            )}
            {game.qiita_url && (
              <a
                href={game.qiita_url}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-button px-3 py-1.5 bg-[#8b4513] hover:bg-[#8b4513] text-white font-bold transition-all shadow-[1.5px_1.5px_0_#000]"
                title="Qiita"
              >
                <Twemoji emoji="📝" size={13} />
              </a>
            )}
            </div>
          </div>
        </div>
      </div>
  );
}
