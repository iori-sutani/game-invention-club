import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/tags - Get all tags with optional search
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '50');

  const supabase = await createClient();

  let dbQuery = supabase
    .from('tags')
    .select('*')
    .order('usage_count', { ascending: false })
    .limit(limit);

  // Apply search filter if provided
  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`);
  }

  const { data: tags, error } = await dbQuery;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(tags);
}
