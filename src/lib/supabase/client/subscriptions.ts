import { supabase } from './index';
import type { Subscription, SubscriptionInsert, SubscriptionUpdate } from '@/types/subscription';

/**
 * 현재 사용자의 모든 구독 목록 가져오기
 */
export async function getSubscriptions(): Promise<Subscription[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Subscription[];
}

/**
 * 활성 구독만 가져오기
 */
export async function getActiveSubscriptions(): Promise<Subscription[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Subscription[];
}

/**
 * 특정 구독 가져오기
 */
export async function getSubscriptionById(id: string): Promise<Subscription | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase.from('subscriptions').select('*').eq('id', id).eq('user_id', user.id).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // 데이터 없음
    }
    throw error;
  }

  return data as Subscription;
}

/**
 * 구독 추가
 */
export async function createSubscription(subscription: SubscriptionInsert): Promise<Subscription> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      ...subscription,
      user_id: user.id,
      currency: subscription.currency || 'KRW',
      is_active: subscription.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Subscription;
}

/**
 * 구독 수정
 */
export async function updateSubscription(id: string, updates: SubscriptionUpdate): Promise<Subscription> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Subscription;
}

/**
 * 구독 삭제
 */
export async function deleteSubscription(id: string): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase.from('subscriptions').delete().eq('id', id).eq('user_id', user.id);

  if (error) {
    throw error;
  }
}
