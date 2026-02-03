import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/games - Get all games with optional filtering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const tags = searchParams.get('tags')?.split(',').filter(Boolean);
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

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

  // Build the query
  let query = supabase
    .from('games')
    .select(`
      *,
      user:users(id, username, avatar_url),
      game_tags(tag:tags(*)),
      likes(count)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Apply search filter
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data: games, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Filter by tags if provided (post-query filtering for now)
  let filteredGames = games || [];
  if (tags && tags.length > 0) {
    filteredGames = filteredGames.filter(game => {
      const gameTags = game.game_tags?.map((gt: { tag: { name: string } }) => gt.tag.name) || [];
      return tags.some(tag => gameTags.includes(tag));
    });
  }

  // Get likes status for current user
  let userLikes: string[] = [];
  if (currentUserId) {
    const gameIds = filteredGames.map(g => g.id);
    const { data: likesData } = await supabase
      .from('likes')
      .select('game_id')
      .eq('user_id', currentUserId)
      .in('game_id', gameIds);
    userLikes = likesData?.map(l => l.game_id) || [];
  }

  // Transform the response
  const transformedGames = filteredGames.map(game => ({
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
    is_liked: userLikes.includes(game.id),
  }));

  return NextResponse.json(transformedGames);
}

// POST /api/games - Create a new game
export async function POST(request: Request) {
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

  const body = await request.json();
  const { title, description, screenshot_url, vercel_url, github_url, qiita_url, tags } = body;

  // Validate required fields
  if (!title || !description || !screenshot_url || !vercel_url) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Create the game
  const { data: game, error: gameError } = await supabase
    .from('games')
    .insert({
      user_id: dbUser.id,
      title,
      description,
      screenshot_url,
      vercel_url,
      github_url: github_url || null,
      qiita_url: qiita_url || null,
    })
    .select()
    .single();

  if (gameError) {
    return NextResponse.json({ error: gameError.message }, { status: 500 });
  }

  // Handle tags
  if (tags && tags.length > 0) {
    const tagIds: string[] = [];

    for (const tagName of tags) {
      // Check if tag exists
      let { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .single();

      if (!existingTag) {
        // Create new tag
        const { data: newTag, error: tagError } = await supabase
          .from('tags')
          .insert({ name: tagName })
          .select('id')
          .single();

        if (tagError) {
          console.error('Error creating tag:', tagError);
          continue;
        }
        existingTag = newTag;
      }

      if (existingTag) {
        tagIds.push(existingTag.id);
      }
    }

    // Create game_tags entries
    if (tagIds.length > 0) {
      const gameTagsData = tagIds.map(tagId => ({
        game_id: game.id,
        tag_id: tagId,
      }));

      const { error: gameTagsError } = await supabase
        .from('game_tags')
        .insert(gameTagsData);

      if (gameTagsError) {
        console.error('Error creating game tags:', gameTagsError);
      }
    }
  }

  return NextResponse.json(game, { status: 201 });
}
