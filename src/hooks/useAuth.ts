'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/db/client';
import type { User } from '@supabase/supabase-js';

interface UseAuthReturn {
  /** Supabase Auth のユーザー */
  user: User | null;
  /** 内部DBのユーザーID */
  internalUserId: string | null;
  /** 認証状態の読み込み中 */
  loading: boolean;
  /** GitHubアバターURL */
  avatarUrl: string | null;
  /** GitHubユーザー名 */
  username: string;
  /** GitHubでログイン */
  login: (redirectPath?: string) => Promise<void>;
  /** ログアウト */
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [internalUserId, setInternalUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 内部DBのユーザーIDを取得
  const fetchInternalUserId = useCallback(async () => {
    try {
      const res = await fetch('/api/users/me');
      if (res.ok) {
        const data = await res.json();
        if (data?.id) {
          setInternalUserId(data.id);
        }
      }
    } catch {
      // エラーは無視
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // 初期ユーザー取得
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);

      if (user) {
        fetchInternalUserId();
      }
    });

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchInternalUserId();
        } else {
          setInternalUserId(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchInternalUserId]);

  const login = useCallback(async (redirectPath?: string) => {
    const supabase = createClient();
    const redirectTo = redirectPath
      ? `${window.location.origin}/api/auth/callback?next=${redirectPath}`
      : `${window.location.origin}/api/auth/callback`;

    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo },
    });
  }, []);

  const logout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setInternalUserId(null);
    window.location.href = '/';
  }, []);

  // 派生値
  const avatarUrl = user?.user_metadata?.avatar_url ?? null;
  const username = user?.user_metadata?.user_name || user?.user_metadata?.name || 'User';

  return {
    user,
    internalUserId,
    loading,
    avatarUrl,
    username,
    login,
    logout,
  };
}
