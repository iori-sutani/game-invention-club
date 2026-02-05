import { createRepositories } from '@/lib/repositories';
import { NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

// GET /api/users/[id]/games - Get games by user
export async function GET(request: Request, { params }: { params: Params }) {
  const { id: userId } = await params;
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  const { auth, users, games, likes } = await createRepositories();

  // Get current user for is_liked field
  const authUser = await auth.getUser();
  let currentUserId: string | null = null;

  if (authUser) {
    const dbUser = await users.findByGithubId(authUser.id);
    currentUserId = dbUser?.id || null;
  }

  try {
    const gameList = await games.listByUserId(userId, { offset, limit });

    // Get likes status for current user
    let userLikes: string[] = [];
    if (currentUserId && gameList.length > 0) {
      userLikes = await likes.findLikedGameIds(
        currentUserId,
        gameList.map(g => g.id),
      );
    }

    // Transform the response
    const result = gameList.map(game => ({
      ...game,
      is_liked: userLikes.includes(game.id),
    }));

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
