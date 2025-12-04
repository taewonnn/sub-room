import { createClient } from './index';
import { redirect } from 'next/navigation';

export async function getServerUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  return user;
}
