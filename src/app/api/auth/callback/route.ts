import { createRepositories } from '@/lib/repositories';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const { auth, users } = await createRepositories();
    const authUser = await auth.exchangeCodeForSession(code);

    if (authUser) {
      // Check if user exists in our users table
      const existingUser = await users.findByGithubId(authUser.id);

      // If user doesn't exist, create them
      if (!existingUser) {
        try {
          await users.create({
            github_id: authUser.id,
            username: authUser.userMetadata.userName || authUser.userMetadata.name || 'Anonymous',
            avatar_url: authUser.userMetadata.avatarUrl || null,
          });
        } catch (error) {
          console.error('Error creating user:', error);
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
