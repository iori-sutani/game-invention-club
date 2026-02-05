import { createRepositories } from '@/lib/repositories';
import { NextResponse } from 'next/server';

// GET /api/games - Get all games with optional filtering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const tags = searchParams.get('tags')?.split(',').filter(Boolean);
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
    const gameList = await games.list({ search, tags, offset, limit });

    // Get likes status for current user
    let userLikes: string[] = [];
    if (currentUserId && gameList.length > 0) {
      userLikes = await likes.findLikedGameIds(
        currentUserId,
        gameList.map(g => g.id),
      );
    }

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

// POST /api/games - Create a new game
export async function POST(request: Request) {
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

  const body = await request.json();
  const { title, description, screenshot_url, vercel_url, github_url, qiita_url, tags: tagNames } = body;

  // Validate required fields
  if (!title || !description || !screenshot_url || !vercel_url) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Create the game
    const game = await games.create({
      user_id: dbUser.id,
      title,
      description,
      screenshot_url,
      vercel_url,
      github_url: github_url || null,
      qiita_url: qiita_url || null,
    });

    // Handle tags
    if (tagNames && tagNames.length > 0) {
      const tagIds: string[] = [];

      for (const tagName of tagNames) {
        let tag = await tags.findByName(tagName);

        if (!tag) {
          try {
            tag = await tags.create(tagName);
          } catch (e) {
            console.error('Error creating tag:', e);
            continue;
          }
        }

        tagIds.push(tag.id);
      }

      // Create game_tags entries
      if (tagIds.length > 0) {
        await tags.linkToGame(game.id, tagIds);
      }
    }

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
