'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Calendar, CreditCard, FileText, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Subscription } from '@/types/subscription';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  formatPrice,
  calculateAnnualCost,
  calculateSubscriptionDuration,
  calculateTotalSpent,
  billingCycleLabels,
  categoryColors,
} from '@/lib/subscription/utils';

interface SubscriptionDetailProps {
  subscription: Subscription;
}

export default function SubscriptionDetail({ subscription }: SubscriptionDetailProps) {
  console.log('subscription', subscription);
  const router = useRouter();

  const annualCost = calculateAnnualCost(subscription);
  const duration = calculateSubscriptionDuration(subscription);
  const totalSpent = calculateTotalSpent(subscription);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="space-y-4">
        {/* 상단: 뒤로 버튼 + 제목 */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold truncate flex-1">{subscription.name}</h1>
        </div>

        {/* 중간: 배지들 */}
        <div className="flex items-center gap-2 flex-wrap">
          {subscription.category && <Badge className={categoryColors[subscription.category]}>{subscription.category}</Badge>}
          <Badge variant={subscription.is_active ? 'default' : 'secondary'}>{subscription.is_active ? '활성' : '일시정지'}</Badge>
        </div>

        {/* 하단: 액션 버튼들 */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Edit className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">수정</span>
          </Button>
          <Button variant="outline" size="sm" className="text-destructive flex-1 sm:flex-none">
            <Trash2 className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">삭제</span>
          </Button>
        </div>
      </div>

      {/* 가격 정보 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            가격 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-4xl font-bold">{formatPrice(subscription.price, subscription.currency)}</div>
            <div className="text-sm text-muted-foreground">/ {billingCycleLabels[subscription.billing_cycle]}</div>
          </div>
          {annualCost && subscription.billing_cycle !== 'YEARLY' && (
            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground">연간 약</div>
              <div className="text-xl font-semibold">{formatPrice(annualCost, subscription.currency)}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 다음 결제일 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            다음 결제일
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg text-muted-foreground">데이터 준비 중...</div>
          <div className="text-sm text-muted-foreground mt-2">{/* next_billing_date가 타입에 추가되면 여기에 표시 */}</div>
        </CardContent>
      </Card>

      {/* 결제 수단 카드 */}
      {subscription.payment_method && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              결제 수단
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">{subscription.payment_method}</div>
          </CardContent>
        </Card>
      )}

      {/* 통계 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            통계
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              구독 기간
            </div>
            <div className="text-lg font-semibold mt-1">
              {duration.months > 0 ? `${duration.months}개월` : ''} {duration.days}일
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground">총 지출</div>
            <div className="text-lg font-semibold mt-1">{formatPrice(totalSpent, subscription.currency)}</div>
          </div>
        </CardContent>
      </Card>

      {/* 지출 추이 그래프 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>지출 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">그래프 영역(@todo)</div>
        </CardContent>
      </Card>

      {/* 메모 카드 */}
      {subscription.memo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              메모
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{subscription.memo}</p>
          </CardContent>
        </Card>
      )}

      {/* 메타데이터 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <div className="text-muted-foreground">생성일</div>
            <div>{new Date(subscription.created_at).toLocaleDateString('ko-KR')}</div>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(subscription.created_at), { addSuffix: true, locale: ko })}
            </div>
          </div>
          <div className="pt-3 border-t">
            <div className="text-muted-foreground">수정일</div>
            <div>{new Date(subscription.updated_at).toLocaleDateString('ko-KR')}</div>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(subscription.updated_at), { addSuffix: true, locale: ko })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
