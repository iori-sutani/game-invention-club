import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { ILikeRepository } from '../interfaces';

export class SupabaseLikeRepository implements ILikeRepository {
  constructor(private client: SupabaseClient<Database>) {}

  async create(userId: string, gameId: string): Promise<void> {
    const { error } = await this.client
      .from('likes')
      .insert({ user_id: userId, game_id: gameId });
    if (error) throw error;
  }

  async delete(userId: string, gameId: string): Promise<void> {
    const { error } = await this.client
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('game_id', gameId);
    if (error) throw error;
  }

  async exists(userId: string, gameId: string): Promise<boolean> {
    const { data } = await this.client
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .single();
    return !!data;
  }

  async countByGameId(gameId: string): Promise<number> {
    const { count } = await this.client
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('game_id', gameId);
    return count ?? 0;
  }

  async countByGameIds(gameIds: string[]): Promise<number> {
    if (gameIds.length === 0) return 0;
    const { count } = await this.client
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .in('game_id', gameIds);
    return count ?? 0;
  }

  async findLikedGameIds(userId: string, gameIds: string[]): Promise<string[]> {
    if (gameIds.length === 0) return [];
    const { data } = await this.client
      .from('likes')
      .select('game_id')
      .eq('user_id', userId)
      .in('game_id', gameIds);
    return data?.map(l => l.game_id) ?? [];
  }
}
