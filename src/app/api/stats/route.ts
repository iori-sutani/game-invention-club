import { createClient } from '@/lib/db/server';
import { NextResponse } from 'next/server';

// GET /api/stats - Get platform statistics
export async function GET() {
  const supabase = await createClient();

  try {
    // Get games count
    const { count: gamesCount, error: gamesError } = await supabase
      .from('games')
      .select('*', { count: 'exact', head: true });

    if (gamesError) throw gamesError;

    // Get users count
    const { count: usersCount, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) throw usersError;

    // Get tags count
    const { count: tagsCount, error: tagsError } = await supabase
      .from('tags')
      .select('*', { count: 'exact', head: true });

    if (tagsError) throw tagsError;

    return NextResponse.json({
      games_count: gamesCount ?? 0,
      users_count: usersCount ?? 0,
      tags_count: tagsCount ?? 0,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
