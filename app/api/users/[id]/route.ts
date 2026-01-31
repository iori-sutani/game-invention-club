import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

// GET /api/users/[id] - Get a user by ID
export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from('users')
    .select('id, username, avatar_url, created_at')
    .eq('id', id)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Get games count
  const { count: gamesCount } = await supabase
    .from('games')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', id);

  // Get total likes received
  const { data: games } = await supabase
    .from('games')
    .select('id')
    .eq('user_id', id);

  let totalLikes = 0;
  if (games && games.length > 0) {
    const gameIds = games.map(g => g.id);
    const { count: likesCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .in('game_id', gameIds);
    totalLikes = likesCount || 0;
  }

  return NextResponse.json({
    ...user,
    games_count: gamesCount || 0,
    total_likes: totalLikes,
  });
}
