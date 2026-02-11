'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Twemoji } from '@/components/Twemoji';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const pathname = usePathname();
  const { user, internalUserId, loading, avatarUrl, username, login, logout } = useAuth();

  const isGamesActive = pathname === '/games';
  const isSubmitActive = pathname === '/submit';

  return (
    <header className="border-b-[3px] border-black bg-[#8b4513] sticky top-0 z-50">
      <nav className="px-3 md:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#fbad08] border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0_#000]">
            <Twemoji emoji="🎮" size={20} />
          </div>
          <h1 className="text-lg md:text-2xl font-bold text-white tracking-widest drop-shadow-[1.5px_1.5px_0_#900] group-hover:text-[#fbad08] transition-colors">
            ゲーム発明会
          </h1>
        </Link>

        <div className="flex gap-2 md:gap-3 items-center">
          <Link
            href="/games"
            className={`pixel-button px-2 md:px-5 py-1.5 md:py-2 no-underline shadow-[3px_3px_0_#000] ${
              isGamesActive
                ? 'bg-[#c46237] text-white hover:bg-[#e45c10]'
                : 'bg-[#fbad08] text-black hover:bg-[#8b4513] '
            }`}
          >
            一覧
          </Link>
          <Link
            href="/submit"
            className={`pixel-button px-2 md:px-5 py-1.5 md:py-2 no-underline shadow-[3px_3px_0_#000] ${
              isSubmitActive
                ? 'bg-[#c46237] text-white hover:bg-[#e45c10]'
                : 'bg-[#fbad08] text-black hover:bg-[#8b4513] '
            }`}
          >
            投稿
          </Link>

          <div className="w-[2px] h-6 bg-[#5e300d]" />

          {loading ? (
            <div className="w-[64px] md:w-[96px] h-[32px] bg-[#5e300d] border-[3px] border-black animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-1.5 md:gap-2">
              <Link
                href={internalUserId ? `/users/${internalUserId}` : '#'}
                className="pixel-button flex items-center justify-center w-[36px] h-[36px] md:w-[44px] md:h-[44px] !p-0 border-[3px] border-black overflow-hidden shadow-[3px_3px_0_#000] bg-[#fbad08] hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_#000] transition-all"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                ) : (
                  <Twemoji emoji="👤" size={20} />
                )}
              </Link>
              <button
                onClick={logout}
                className="pixel-button px-2 md:px-5 py-1.5 md:py-2 bg-[#5e300d] text-white hover:bg-[#8b4513] shadow-[3px_3px_0_#000]"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <button
              onClick={() => login()}
              className="pixel-button px-2 md:px-5 py-1.5 md:py-2 bg-[#333] text-white hover:bg-[#8b4513] hover:text-black shadow-[3px_3px_0_#000]"
            >
              ログイン
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
