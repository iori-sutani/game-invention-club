import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/users/me - Get current authenticated user
export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: dbUser, error } = await supabase
    .from('users')
    .select('*')
    .eq('github_id', user.id)
    .single();

  if (error || !dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(dbUser);
}
