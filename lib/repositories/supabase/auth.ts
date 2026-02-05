import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { IAuthRepository, AuthUser } from '../interfaces';

export class SupabaseAuthRepository implements IAuthRepository {
  constructor(private client: SupabaseClient<Database>) {}

  async getUser(): Promise<AuthUser | null> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return null;
    return {
      id: user.id,
      userMetadata: {
        userName: user.user_metadata?.user_name as string | undefined,
        name: user.user_metadata?.name as string | undefined,
        avatarUrl: user.user_metadata?.avatar_url as string | undefined,
      },
    };
  }

  async exchangeCodeForSession(code: string): Promise<AuthUser | null> {
    const { data, error } = await this.client.auth.exchangeCodeForSession(code);
    if (error || !data.user) return null;
    return {
      id: data.user.id,
      userMetadata: {
        userName: data.user.user_metadata?.user_name as string | undefined,
        name: data.user.user_metadata?.name as string | undefined,
        avatarUrl: data.user.user_metadata?.avatar_url as string | undefined,
      },
    };
  }
}
