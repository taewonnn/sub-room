'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Subscription } from '@/types/subscription';
import { CreditCard } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
  onClick?: () => void;
}

const billingCycleLabels = {
  monthly: '월간',
  yearly: '연간',
  'one-time': '일회성',
};

const categoryColors = {
  OTT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  VPN: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  COURSE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};

export default function SubscriptionCard({ subscription, onClick }: SubscriptionCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: currency || 'KRW',
    }).format(price);
  };

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${!subscription.is_active ? 'opacity-60' : ''}`} onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold">{subscription.name}</CardTitle>
          {subscription.category && <Badge className={categoryColors[subscription.category]}>{subscription.category}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 가격 정보 */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{formatPrice(subscription.price, subscription.currency)}</span>
          <span className="text-sm text-muted-foreground">/ {billingCycleLabels[subscription.billing_cycle]}</span>
        </div>

        {/* 다음 결제일 & 결제 수단 */}
        <div className="space-y-2 text-sm">
          {subscription.payment_method && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>{subscription.payment_method}</span>
            </div>
          )}
        </div>

        {/* 비활성 상태 표시 */}
        {!subscription.is_active && (
          <div className="pt-2 border-t">
            <Badge variant="secondary" className="text-xs">
              일시정지됨
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
