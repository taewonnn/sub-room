import { getServerSubscriptions } from '@/lib/supabase/server/subscriptions';
import SubscriptionCard from './SubscriptionCard';

export default async function SubscriptionList() {
  const subscriptions = await getServerSubscriptions();

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">아직 등록된 구독이 없습니다.</p>
        <p className="text-sm text-muted-foreground mt-2">+ 추가 버튼을 눌러 구독을 추가해보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
}
