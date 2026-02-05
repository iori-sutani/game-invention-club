import { SupabaseClient } from '@supabase/supabase-js';
import { Database, User } from '@/types/database';
import { IUserRepository, UserProfile } from '../interfaces';

export class SupabaseUserRepository implements IUserRepository {
  constructor(private client: SupabaseClient<Database>) {}

  async findByGithubId(githubId: string): Promise<{ id: string } | null> {
    const { data } = await this.client
      .from('users')
      .select('id')
      .eq('github_id', githubId)
      .single();
    return data;
  }

  async findFullByGithubId(githubId: string): Promise<User | null> {
    const { data } = await this.client
      .from('users')
      .select('*')
      .eq('github_id', githubId)
      .single();
    return data;
  }

  async findById(id: string): Promise<UserProfile | null> {
    const { data } = await this.client
      .from('users')
      .select('id, username, avatar_url, created_at')
      .eq('id', id)
      .single();
    return data;
  }

  async create(data: { github_id: string; username: string; avatar_url: string | null }): Promise<void> {
    const { error } = await this.client.from('users').insert(data);
    if (error) throw error;
  }
}
