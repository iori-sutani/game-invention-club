import { createClient } from '@/lib/db/server';
import {
  IAuthRepository,
  IUserRepository,
  IGameRepository,
  ITagRepository,
  ILikeRepository,
} from './interfaces';
import {
  SupabaseAuthRepository,
  SupabaseUserRepository,
  SupabaseGameRepository,
  SupabaseTagRepository,
  SupabaseLikeRepository,
} from './impl';

export type Repositories = {
  auth: IAuthRepository;
  users: IUserRepository;
  games: IGameRepository;
  tags: ITagRepository;
  likes: ILikeRepository;
};

export async function createRepositories(): Promise<Repositories> {
  const supabase = await createClient();
  return {
    auth: new SupabaseAuthRepository(supabase),
    users: new SupabaseUserRepository(supabase),
    games: new SupabaseGameRepository(supabase),
    tags: new SupabaseTagRepository(supabase),
    likes: new SupabaseLikeRepository(supabase),
  };
}

export type {
  IAuthRepository,
  IUserRepository,
  IGameRepository,
  ITagRepository,
  ILikeRepository,
  AuthUser,
  GameDetail,
  CreateGameInput,
  UpdateGameInput,
  UserProfile,
} from './interfaces';
