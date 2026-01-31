import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

type Params = Promise<{ id: string }>;

// POST /api/games/[id]/like - Add a like
export async function POST(request: Request, { params }: { params: Params }) {
  const { id: gameId } = await params;
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

  // Check if game exists
  const { data: game } = await supabase
    .from('games')
    .select('id')
    .eq('id', gameId)
    .single();

  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  // Check if already liked
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', dbUser.id)
    .eq('game_id', gameId)
    .single();

  if (existingLike) {
    return NextResponse.json({ error: 'Already liked' }, { status: 400 });
  }

  // Create like
  const { error } = await supabase.from('likes').insert({
    user_id: dbUser.id,
    game_id: gameId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get updated likes count
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('game_id', gameId);

  return NextResponse.json({ success: true, likes_count: count || 0 });
}

// DELETE /api/games/[id]/like - Remove a like
export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id: gameId } = await params;
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

  // Delete like
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', dbUser.id)
    .eq('game_id', gameId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get updated likes count
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('game_id', gameId);

  return NextResponse.json({ success: true, likes_count: count || 0 });
}
