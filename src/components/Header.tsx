'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/db/client';
import { Twemoji } from '@/components/Twemoji';
import type { User } from '@supabase/supabase-js';

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [internalUserId, setInternalUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isGamesActive = pathname === '/games';
  const isSubmitActive = pathname === '/submit';

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);

      if (user) {
        fetch('/api/users/me')
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data?.id) {
              setInternalUserId(data.id);
            }
          })
          .catch(() => {});
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          setInternalUserId(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  const avatarUrl = user?.user_metadata?.avatar_url;
  const username = user?.user_metadata?.user_name || user?.user_metadata?.name || 'User';

  return (
    <header className="border-b-4 border-black bg-[#8b4513] sticky top-0 z-50">
      <nav className="px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-[#fbad08] border-4 border-black flex items-center justify-center shadow-[4px_4px_0_#000]">
            <Twemoji emoji="🎮" size={24} />
          </div>
          <h1 className="text-xl md:text-3xl font-bold text-white tracking-widest drop-shadow-[2px_2px_0_#900] group-hover:text-[#fbad08] transition-colors">
            ゲーム発明会
          </h1>
        </Link>

        <div className="flex gap-3 md:gap-4 items-center">
          <Link
            href="/games"
            className={`pixel-button px-3 md:px-6 py-2 md:py-3 no-underline shadow-[4px_4px_0_#000] ${
              isGamesActive
                ? 'bg-[#c46237] text-white hover:bg-[#e45c10]'
                : 'bg-[#fbad08] text-black hover:bg-[#8b4513] '
            }`}
          >
            一覧
          </Link>
          <Link
            href="/submit"
            className={`pixel-button px-3 md:px-6 py-2 md:py-3 no-underline shadow-[4px_4px_0_#000] ${
              isSubmitActive
                ? 'bg-[#c46237] text-white hover:bg-[#e45c10]'
                : 'bg-[#fbad08] text-black hover:bg-[#8b4513] '
            }`}
          >
            投稿
          </Link>

          <div className="w-[3px] h-8 bg-[#5e300d]" />

          {loading ? (
            <div className="w-[80px] md:w-[120px] h-[40px] bg-[#5e300d] border-4 border-black animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href={internalUserId ? `/users/${internalUserId}` : '#'}
                className="pixel-button flex items-center justify-center w-[44px] h-[44px] md:w-[54px] md:h-[54px] !p-0 border-4 border-black overflow-hidden shadow-[4px_4px_0_#000] bg-[#fbad08] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username}
                    fill
                    sizes="54px"
                    className="object-cover"
                  />
                ) : (
                  <Twemoji emoji="👤" size={24} />
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="pixel-button px-3 md:px-6 py-2 md:py-3 bg-[#5e300d] text-white hover:bg-[#8b4513] shadow-[4px_4px_0_#000]"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="pixel-button px-3 md:px-6 py-2 md:py-3 bg-[#333] text-white hover:bg-[#8b4513] hover:text-black shadow-[4px_4px_0_#000]"
            >
              ログイン
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
