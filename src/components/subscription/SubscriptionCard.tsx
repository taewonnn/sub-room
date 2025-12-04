'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Subscription } from '@/types/subscription';
import { CreditCard, Film, Shield, BookOpen, Package } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
  onClick?: () => void;
}

const billingCycleLabels = {
  MONTHLY: '월간',
  YEARLY: '연간',
  WEEKLY: '주간',
  ONE_TIME: '일회성',
};

const categoryColors = {
  OTT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  VPN: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  COURSE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};

const categoryIcons = {
  OTT: Film,
  VPN: Shield,
  COURSE: BookOpen,
  OTHER: Package,
};

const categoryGradients = {
  OTT: 'from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950',
  VPN: 'from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950',
  COURSE: 'from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950',
  OTHER: 'from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950',
};

export default function SubscriptionCard({ subscription, onClick }: SubscriptionCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: currency || 'KRW',
    }).format(price);
  };

  const calculateAnnualCost = () => {
    if (subscription.billing_cycle === 'ONE_TIME') {
      return null;
    }
    if (subscription.billing_cycle === 'YEARLY') {
      return subscription.price;
    } else if (subscription.billing_cycle === 'MONTHLY') {
      return subscription.price * 12;
    } else if (subscription.billing_cycle === 'WEEKLY') {
      return subscription.price * 52;
    }
    return null;
  };

  const annualCost = calculateAnnualCost();
  const CategoryIcon = subscription.category ? categoryIcons[subscription.category] : Package;
  const gradient = subscription.category ? categoryGradients[subscription.category] : categoryGradients.OTHER;

  return (
    <Card
      className={`group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2 ${
        !subscription.is_active ? 'opacity-60' : ''
      } ${subscription.category ? `bg-linear-to-br ${gradient}` : ''}`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {subscription.category && (
              <div className={`p-2 rounded-lg ${categoryColors[subscription.category]} shrink-0`}>
                <CategoryIcon className="h-5 w-5" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">{subscription.name}</CardTitle>
              {subscription.memo && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{subscription.memo}</p>}
            </div>
          </div>
          {subscription.category && <Badge className={`${categoryColors[subscription.category]} shrink-0`}>{subscription.category}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 가격 정보 */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{formatPrice(subscription.price, subscription.currency)}</span>
            <span className="text-sm text-muted-foreground">/ {billingCycleLabels[subscription.billing_cycle]}</span>
          </div>
          {annualCost && subscription.billing_cycle !== 'YEARLY' && (
            <div className="text-xs text-muted-foreground">연간 약 {formatPrice(annualCost, subscription.currency)}</div>
          )}
          {annualCost && subscription.billing_cycle !== 'MONTHLY' && (
            <div className="text-xs text-muted-foreground">월간 약 {formatPrice(annualCost / 12, subscription.currency)}</div>
          )}
          {annualCost && subscription.billing_cycle !== 'WEEKLY' && (
            <div className="text-xs text-muted-foreground">주간 약 {formatPrice(annualCost / 52, subscription.currency)}</div>
          )}
        </div>

        {/* 결제 수단 */}
        {subscription.payment_method && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4 shrink-0" />
            <span className="truncate">{subscription.payment_method}</span>
          </div>
        )}

        {/* 비활성 상태 표시 */}
        {!subscription.is_active && (
          <div className="pt-3 border-t border-dashed">
            <Badge variant="secondary" className="text-xs">
              일시정지됨
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
