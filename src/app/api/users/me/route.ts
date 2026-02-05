import { createRepositories } from '@/lib/repositories';
import { NextResponse } from 'next/server';

// GET /api/users/me - Get current authenticated user
export async function GET() {
  const { auth, users } = await createRepositories();

  const authUser = await auth.getUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbUser = await users.findFullByGithubId(authUser.id);
  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(dbUser);
}
