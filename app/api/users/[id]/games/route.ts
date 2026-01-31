import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

// GET /api/users/[id]/games - Get games by user
export async function GET(request: Request, { params }: { params: Params }) {
  const { id: userId } = await params;
  const { searchParams } = new URL(request.url);
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

  const { data: games, error } = await supabase
    .from('games')
    .select(`
      *,
      user:users(id, username, avatar_url),
      game_tags(tag:tags(*)),
      likes(count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get likes status for current user
  let userLikes: string[] = [];
  if (currentUserId && games && games.length > 0) {
    const gameIds = games.map(g => g.id);
    const { data: likesData } = await supabase
      .from('likes')
      .select('game_id')
      .eq('user_id', currentUserId)
      .in('game_id', gameIds);
    userLikes = likesData?.map(l => l.game_id) || [];
  }

  // Transform the response
  const transformedGames = (games || []).map(game => ({
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
