import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('subscriptions').select('count').limit(1);
    if (error) {
      console.error('Failed to fetch subscriptions:', error);
      return false;
    }
    console.log('data', data);
    console.log('✅ Supabase 연결 성공!');
    console.log('URL:', supabaseUrl);
    return true;
  } catch (err) {
    console.error('❌ Supabase 연결 오류:', err);
    return false;
  }
};
