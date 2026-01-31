import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

// GET /api/games/[id] - Get a single game
export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  // Get current user for is_liked field
  const { data: { user } } = await supabase.auth.getUser();
  let currentUserId: string | null = null;

  if (user) {
    const { data: currentUser } = await supabase
      .from('users')
      .select('id')
      .eq('github_id', user.id)
      .single();
    currentUserId = currentUser?.id || null;
  }

  const { data: game, error } = await supabase
    .from('games')
    .select(`
      *,
      user:users(id, username, avatar_url),
      game_tags(tag:tags(*)),
      likes(count)
    `)
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  // Check if current user liked this game
  let isLiked = false;
  if (currentUserId) {
    const { data: likeData } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', currentUserId)
      .eq('game_id', id)
      .single();
    isLiked = !!likeData;
  }

  const transformedGame = {
    id: game.id,
    title: game.title,
    description: game.description,
    screenshot_url: game.screenshot_url,
    vercel_url: game.vercel_url,
    github_url: game.github_url,
    qiita_url: game.qiita_url,
    created_at: game.created_at,
    updated_at: game.updated_at,
    user: game.user,
    tags: game.game_tags?.map((gt: { tag: { id: string; name: string } }) => gt.tag) || [],
    likes_count: game.likes?.[0]?.count || 0,
    is_liked: isLiked,
  };

  return NextResponse.json(transformedGame);
}

// PUT /api/games/[id] - Update a game
export async function PUT(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user from our users table
  const { data: dbUser } = await supabase
    .from('users')
    .select('id')
    .eq('github_id', user.id)
    .single();

  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Check if user owns this game
  const { data: existingGame } = await supabase
    .from('games')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!existingGame) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  if (existingGame.user_id !== dbUser.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, screenshot_url, vercel_url, github_url, qiita_url, tags } = body;

  // Update the game
  const { data: game, error: gameError } = await supabase
    .from('games')
    .update({
      title,
      description,
      screenshot_url,
      vercel_url,
      github_url,
      qiita_url: qiita_url || null,
    })
    .eq('id', id)
    .select()
    .single();

  if (gameError) {
    return NextResponse.json({ error: gameError.message }, { status: 500 });
  }

  // Update tags if provided
  if (tags !== undefined) {
    // Delete existing tags
    await supabase
      .from('game_tags')
      .delete()
      .eq('game_id', id);

    // Add new tags
    if (tags.length > 0) {
      const tagIds: string[] = [];

      for (const tagName of tags) {
        let { data: existingTag } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .single();

        if (!existingTag) {
          const { data: newTag } = await supabase
            .from('tags')
            .insert({ name: tagName })
            .select('id')
            .single();
          existingTag = newTag;
        }

        if (existingTag) {
          tagIds.push(existingTag.id);
        }
      }

      if (tagIds.length > 0) {
        const gameTagsData = tagIds.map(tagId => ({
          game_id: id,
          tag_id: tagId,
        }));

        await supabase.from('game_tags').insert(gameTagsData);
      }
    }
  }

  return NextResponse.json(game);
}

// DELETE /api/games/[id] - Delete a game
export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user from our users table
  const { data: dbUser } = await supabase
    .from('users')
    .select('id')
    .eq('github_id', user.id)
    .single();

  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Check if user owns this game
  const { data: existingGame } = await supabase
    .from('games')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!existingGame) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  if (existingGame.user_id !== dbUser.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Delete the game (cascade will handle game_tags and likes)
  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
