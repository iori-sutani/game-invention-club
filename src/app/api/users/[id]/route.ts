import { createRepositories } from '@/lib/repositories';
import { NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

// GET /api/users/[id] - Get a user by ID
export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const { users, games, likes } = await createRepositories();

  const user = await users.findById(id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Get games count
  const gamesCount = await games.countByUserId(id);

  // Get total likes received
  let totalLikes = 0;
  const gameIds = await games.listIdsByUserId(id);
  if (gameIds.length > 0) {
    totalLikes = await likes.countByGameIds(gameIds);
  }

  return NextResponse.json({
    ...user,
    games_count: gamesCount,
    total_likes: totalLikes,
  });
}
