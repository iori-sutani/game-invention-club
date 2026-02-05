import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tag } from '@/types/database';
import { ITagRepository } from '../interfaces';

export class SupabaseTagRepository implements ITagRepository {
  constructor(private client: SupabaseClient<Database>) {}

  async list(options?: { query?: string; limit?: number }): Promise<Tag[]> {
    const limit = options?.limit ?? 50;
    let query = this.client
      .from('tags')
      .select('*')
      .order('usage_count', { ascending: false })
      .limit(limit);

    if (options?.query) {
      query = query.ilike('name', `%${options.query}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  async findByName(name: string): Promise<{ id: string } | null> {
    const { data } = await this.client
      .from('tags')
      .select('id')
      .eq('name', name)
      .single();
    return data;
  }

  async create(name: string): Promise<{ id: string }> {
    const { data, error } = await this.client
      .from('tags')
      .insert({ name })
      .select('id')
      .single();
    if (error || !data) throw error ?? new Error('Failed to create tag');
    return data;
  }

  async linkToGame(gameId: string, tagIds: string[]): Promise<void> {
    if (tagIds.length === 0) return;
    const rows = tagIds.map(tagId => ({ game_id: gameId, tag_id: tagId }));
    const { error } = await this.client.from('game_tags').insert(rows);
    if (error) throw error;
  }

  async unlinkFromGame(gameId: string): Promise<void> {
    const { error } = await this.client
      .from('game_tags')
      .delete()
      .eq('game_id', gameId);
    if (error) throw error;
  }
}
