import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Game, Tag } from '@/types/database';
import { IGameRepository, GameDetail, CreateGameInput, UpdateGameInput } from '../interfaces';

const GAME_WITH_RELATIONS_SELECT = `
  *,
  user:users(id, username, avatar_url),
  game_tags(tag:tags(*)),
  likes(count)
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformGame(raw: any): GameDetail {
  return {
    id: raw.id,
    user_id: raw.user_id,
    title: raw.title,
    description: raw.description,
    screenshot_url: raw.screenshot_url,
    vercel_url: raw.vercel_url,
    github_url: raw.github_url,
    qiita_url: raw.qiita_url,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    user: raw.user,
    tags: raw.game_tags?.map((gt: { tag: Tag }) => gt.tag) || [],
    likes_count: raw.likes?.[0]?.count || 0,
  };
}

export class SupabaseGameRepository implements IGameRepository {
  constructor(private client: SupabaseClient<Database>) {}

  async list(options: { search?: string; tags?: string[]; offset: number; limit: number }): Promise<GameDetail[]> {
    let query = this.client
      .from('games')
      .select(GAME_WITH_RELATIONS_SELECT)
      .order('created_at', { ascending: false })
      .range(options.offset, options.offset + options.limit - 1);

    if (options.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }

    const { data: games, error } = await query;
    if (error) throw error;

    let result = (games || []).map(transformGame);

    if (options.tags && options.tags.length > 0) {
      result = result.filter(game => {
        const gameTagNames = game.tags.map(t => t.name);
        return options.tags!.some(tag => gameTagNames.includes(tag));
      });
    }

    return result;
  }

  async findById(id: string): Promise<GameDetail | null> {
    const { data, error } = await this.client
      .from('games')
      .select(GAME_WITH_RELATIONS_SELECT)
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return transformGame(data);
  }

  async getOwnerId(id: string): Promise<string | null> {
    const { data } = await this.client
      .from('games')
      .select('user_id')
      .eq('id', id)
      .single();
    return data?.user_id ?? null;
  }

  async exists(id: string): Promise<boolean> {
    const { data } = await this.client
      .from('games')
      .select('id')
      .eq('id', id)
      .single();
    return !!data;
  }

  async create(data: CreateGameInput): Promise<Game> {
    const { data: game, error } = await this.client
      .from('games')
      .insert({
        user_id: data.user_id,
        title: data.title,
        description: data.description,
        screenshot_url: data.screenshot_url,
        vercel_url: data.vercel_url,
        github_url: data.github_url ?? undefined,
        qiita_url: data.qiita_url,
      })
      .select()
      .single();
    if (error || !game) throw error ?? new Error('Failed to create game');
    return game;
  }

  async update(id: string, data: UpdateGameInput): Promise<Game> {
    const { data: game, error } = await this.client
      .from('games')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error || !game) throw error ?? new Error('Failed to update game');
    return game;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from('games')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async countByUserId(userId: string): Promise<number> {
    const { count } = await this.client
      .from('games')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    return count ?? 0;
  }

  async listIdsByUserId(userId: string): Promise<string[]> {
    const { data } = await this.client
      .from('games')
      .select('id')
      .eq('user_id', userId);
    return data?.map(g => g.id) ?? [];
  }

  async listByUserId(userId: string, options: { offset: number; limit: number }): Promise<GameDetail[]> {
    const { data: games, error } = await this.client
      .from('games')
      .select(GAME_WITH_RELATIONS_SELECT)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(options.offset, options.offset + options.limit - 1);
    if (error) throw error;
    return (games || []).map(transformGame);
  }
}
