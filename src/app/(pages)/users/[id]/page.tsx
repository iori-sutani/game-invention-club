'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { GameCard } from '@/components/GameCard';
import { Twemoji } from '@/components/Twemoji';
import type { GameWithDetails, User } from '@/types/database';

interface UserProfile extends User {
  games_count: number;
  total_likes: number;
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [games, setGames] = useState<GameWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.status === 404) {
        setError('ユーザーが見つかりませんでした');
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to fetch user');
      }
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setError('ユーザー情報の取得に失敗しました');
    }
  }, [userId]);

  const fetchUserGames = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/${userId}/games`);
      if (res.ok) {
        const data = await res.json();
        setGames(data);
      }
    } catch (err) {
      console.error('Failed to fetch games:', err);
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUserProfile(), fetchUserGames()]);
      setLoading(false);
    };
    fetchData();
  }, [fetchUserProfile, fetchUserGames]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="font-pixel text-[#331100]">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <div className="mb-4 animate-float"><Twemoji emoji="⏳" size={64} /></div>
            <p className="text-2xl text-[#331100]">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="font-pixel text-[#331100]">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <div className="mb-4"><Twemoji emoji="😢" size={64} /></div>
            <p className="text-2xl text-[#331100]">{error || 'ユーザーが見つかりませんでした'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-pixel text-[#331100]">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Profile Section */}
        <div className="flex justify-center mb-12">
          <div className="nes-container bg-white w-full max-w-2xl">
          <div className="flex flex-col items-center gap-6 p-6">
            {/* Avatar */}
            <div className="w-32 h-32 border-4 border-black overflow-hidden bg-[#f8dcb4] flex items-center justify-center">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.username}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Twemoji emoji="👤" size={64} />
              )}
            </div>

            {/* User Info */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#8b4513] mb-2" style={{ textShadow: '2px 2px 0 #fff' }}>
                {user.username}
              </h1>
              <p className="text-[#331100] mb-4">
                {formatDate(user.created_at)} から参加
              </p>

              {/* Stats */}
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#e45c10]">{user.games_count}</div>
                  <div className="text-sm text-[#331100]">投稿ゲーム</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#e45c10]">{user.total_likes}</div>
                  <div className="text-sm text-[#331100]">獲得いいね</div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Games Section */}
        <h2 className="text-3xl font-bold text-[#8b4513] mt-8 mb-8 text-center" style={{ textShadow: '2px 2px 0 #fff' }}>
          投稿したゲーム
        </h2>

        {games.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4"><Twemoji emoji="🎮" size={64} /></div>
            <p className="text-xl text-[#331100]">まだゲームを投稿していません</p>
          </div>
        )}
      </div>
    </div>
  );
}
