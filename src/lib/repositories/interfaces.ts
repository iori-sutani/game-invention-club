import { User, Game, Tag } from '@/types/database';

// Auth types
export type AuthUser = {
  id: string;
  userMetadata: {
    userName?: string;
    name?: string;
    avatarUrl?: string;
  };
};

// Game detail (without is_liked, which depends on auth context)
export type GameDetail = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  screenshot_url: string;
  vercel_url: string;
  github_url?: string;
  qiita_url: string | null;
  created_at: string;
  updated_at: string;
  user: Pick<User, 'id' | 'username' | 'avatar_url'>;
  tags: Tag[];
  likes_count: number;
};

export type CreateGameInput = {
  user_id: string;
  title: string;
  description: string;
  screenshot_url: string;
  vercel_url: string;
  github_url?: string | null;
  qiita_url?: string | null;
};

export type UpdateGameInput = {
  title?: string;
  description?: string;
  screenshot_url?: string;
  vercel_url?: string;
  github_url?: string;
  qiita_url?: string | null;
};

export type UserProfile = Pick<User, 'id' | 'username' | 'avatar_url' | 'created_at'>;

export interface IAuthRepository {
  getUser(): Promise<AuthUser | null>;
  exchangeCodeForSession(code: string): Promise<AuthUser | null>;
}

export interface IUserRepository {
  findByGithubId(githubId: string): Promise<{ id: string } | null>;
  findFullByGithubId(githubId: string): Promise<User | null>;
  findById(id: string): Promise<UserProfile | null>;
  create(data: { github_id: string; username: string; avatar_url: string | null }): Promise<void>;
}

export interface IGameRepository {
  list(options: { search?: string; tags?: string[]; offset: number; limit: number }): Promise<GameDetail[]>;
  findById(id: string): Promise<GameDetail | null>;
  getOwnerId(id: string): Promise<string | null>;
  exists(id: string): Promise<boolean>;
  create(data: CreateGameInput): Promise<Game>;
  update(id: string, data: UpdateGameInput): Promise<Game>;
  delete(id: string): Promise<void>;
  countByUserId(userId: string): Promise<number>;
  listIdsByUserId(userId: string): Promise<string[]>;
  listByUserId(userId: string, options: { offset: number; limit: number }): Promise<GameDetail[]>;
}

export interface ITagRepository {
  list(options?: { query?: string; limit?: number }): Promise<Tag[]>;
  findByName(name: string): Promise<{ id: string } | null>;
  create(name: string): Promise<{ id: string }>;
  linkToGame(gameId: string, tagIds: string[]): Promise<void>;
  unlinkFromGame(gameId: string): Promise<void>;
}

export interface ILikeRepository {
  create(userId: string, gameId: string): Promise<void>;
  delete(userId: string, gameId: string): Promise<void>;
  exists(userId: string, gameId: string): Promise<boolean>;
  countByGameId(gameId: string): Promise<number>;
  countByGameIds(gameIds: string[]): Promise<number>;
  findLikedGameIds(userId: string, gameIds: string[]): Promise<string[]>;
}
