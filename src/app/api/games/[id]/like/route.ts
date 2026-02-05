import { createRepositories } from '@/lib/repositories';
import { NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

// POST /api/games/[id]/like - Add a like
export async function POST(request: Request, { params }: { params: Params }) {
  const { id: gameId } = await params;
  const { auth, users, games, likes } = await createRepositories();

  // Check authentication
  const authUser = await auth.getUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user from our users table
  const dbUser = await users.findByGithubId(authUser.id);
  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Check if game exists
  if (!(await games.exists(gameId))) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  // Check if already liked
  if (await likes.exists(dbUser.id, gameId)) {
    return NextResponse.json({ error: 'Already liked' }, { status: 400 });
  }

  try {
    // Create like
    await likes.create(dbUser.id, gameId);

    // Get updated likes count
    const count = await likes.countByGameId(gameId);
    return NextResponse.json({ success: true, likes_count: count });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/games/[id]/like - Remove a like
export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id: gameId } = await params;
  const { auth, users, likes } = await createRepositories();

  // Check authentication
  const authUser = await auth.getUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user from our users table
  const dbUser = await users.findByGithubId(authUser.id);
  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    // Delete like
    await likes.delete(dbUser.id, gameId);

    // Get updated likes count
    const count = await likes.countByGameId(gameId);
    return NextResponse.json({ success: true, likes_count: count });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
