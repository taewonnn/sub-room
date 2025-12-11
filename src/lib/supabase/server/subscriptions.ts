import { createClient } from './index';
import type { Subscription } from '@/types/subscription';

export async function getServerSubscriptions(): Promise<Subscription[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

  if (error) {
    console.error('구독 목록 로딩 오류:', error);
    return [];
  }

  return (data as Subscription[]) || [];
}

export async function getServerSubscriptionById(id: string): Promise<Subscription | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase.from('subscriptions').select('*').eq('id', id).eq('user_id', user.id).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('구독 상세 로딩 오류:', error);
    return null;
  }

  return data as Subscription;
}
