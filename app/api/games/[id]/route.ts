import { createRepositories } from '@/lib/repositories';
import { NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

// GET /api/games/[id] - Get a single game
export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const { auth, users, games, likes } = await createRepositories();

  // Get current user for is_liked field
  const authUser = await auth.getUser();
  let currentUserId: string | null = null;

  if (authUser) {
    const dbUser = await users.findByGithubId(authUser.id);
    currentUserId = dbUser?.id || null;
  }

  const game = await games.findById(id);
  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  // Check if current user liked this game
  let isLiked = false;
  if (currentUserId) {
    isLiked = await likes.exists(currentUserId, id);
  }

  return NextResponse.json({ ...game, is_liked: isLiked });
}

// PUT /api/games/[id] - Update a game
export async function PUT(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const { auth, users, games, tags } = await createRepositories();

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

  // Check if user owns this game
  const ownerId = await games.getOwnerId(id);
  if (!ownerId) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }
  if (ownerId !== dbUser.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, screenshot_url, vercel_url, github_url, qiita_url, tags: tagNames } = body;

  try {
    // Update the game
    const game = await games.update(id, {
      title,
      description,
      screenshot_url,
      vercel_url,
      github_url,
      qiita_url: qiita_url || null,
    });

    // Update tags if provided
    if (tagNames !== undefined) {
      // Delete existing tags
      await tags.unlinkFromGame(id);

      // Add new tags
      if (tagNames.length > 0) {
        const tagIds: string[] = [];

        for (const tagName of tagNames) {
          let tag = await tags.findByName(tagName);
          if (!tag) {
            tag = await tags.create(tagName);
          }
          tagIds.push(tag.id);
        }

        if (tagIds.length > 0) {
          await tags.linkToGame(id, tagIds);
        }
      }
    }

    return NextResponse.json(game);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/games/[id] - Delete a game
export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const { auth, users, games } = await createRepositories();

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

  // Check if user owns this game
  const ownerId = await games.getOwnerId(id);
  if (!ownerId) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }
  if (ownerId !== dbUser.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // Delete the game (cascade will handle game_tags and likes)
    await games.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
