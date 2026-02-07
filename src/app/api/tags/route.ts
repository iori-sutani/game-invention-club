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

// POST /api/tags - Create a new tag
export async function POST(request: Request) {
  const { auth, tags } = await createRepositories();

  // Check authentication
  const user = await auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
    }

    // Normalize tag name (trim whitespace)
    const normalizedName = name.trim();

    if (normalizedName.length === 0 || normalizedName.length > 50) {
      return NextResponse.json({ error: 'Tag name must be 1-50 characters' }, { status: 400 });
    }

    // Check if tag already exists
    const existing = await tags.findByName(normalizedName);
    if (existing) {
      return NextResponse.json({ id: existing.id, name: normalizedName, exists: true });
    }

    // Create new tag
    const newTag = await tags.create(normalizedName);
    return NextResponse.json({ id: newTag.id, name: normalizedName, exists: false }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
