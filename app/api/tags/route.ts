import { createRepositories } from '@/lib/repositories';
import { NextResponse } from 'next/server';

// GET /api/tags - Get all tags with optional search
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50');

  const { tags } = await createRepositories();

  try {
    const tagList = await tags.list({ query, limit });
    return NextResponse.json(tagList);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
