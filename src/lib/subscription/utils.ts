import type { Subscription, BillingCycle } from '@/types/subscription';

export const billingCycleLabels: Record<BillingCycle, string> = {
  MONTHLY: '월간',
  YEARLY: '연간',
  WEEKLY: '주간',
  ONE_TIME: '일회성',
};

export const categoryColors = {
  OTT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  VPN: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  COURSE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};

/**
 * 가격을 통화 형식으로 포맷팅
 */
export function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: currency || 'KRW',
  }).format(price);
}

/**
 * 구독의 연간 비용 계산
 */
export function calculateAnnualCost(subscription: Subscription): number | null {
  if (subscription.billing_cycle === 'ONE_TIME') return null;
  if (subscription.billing_cycle === 'YEARLY') return subscription.price;
  if (subscription.billing_cycle === 'MONTHLY') return subscription.price * 12;
  if (subscription.billing_cycle === 'WEEKLY') return subscription.price * 52;
  return null;
}

/**
 * 구독 기간 계산 (시작일부터 현재까지)
 */
export function calculateSubscriptionDuration(subscription: Subscription) {
  const startDate = new Date(subscription.created_at);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const months = Math.floor(diffDays / 30);
  const days = diffDays % 30;
  return { months, days, totalDays: diffDays };
}

/**
 * 총 지출 금액 계산
 */
export function calculateTotalSpent(subscription: Subscription): number {
  const duration = calculateSubscriptionDuration(subscription);

  if (subscription.billing_cycle === 'ONE_TIME') return subscription.price;
  if (subscription.billing_cycle === 'MONTHLY') {
    return subscription.price * Math.ceil(duration.totalDays / 30);
  }
  if (subscription.billing_cycle === 'YEARLY') {
    return subscription.price * Math.ceil(duration.totalDays / 365);
  }
  if (subscription.billing_cycle === 'WEEKLY') {
    return subscription.price * Math.ceil(duration.totalDays / 7);
  }
  return 0;
}
