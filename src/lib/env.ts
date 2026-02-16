// 環境変数のバリデーションと一元管理
// Next.jsはビルド時に process.env.NEXT_PUBLIC_* を置換するため、
// 直接参照する必要がある（動的アクセス不可）

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('環境変数 NEXT_PUBLIC_SUPABASE_URL が設定されていません');
}
if (!supabaseAnonKey) {
  throw new Error('環境変数 NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されていません');
}

export const env = {
  supabaseUrl,
  supabaseAnonKey,
} as const;
