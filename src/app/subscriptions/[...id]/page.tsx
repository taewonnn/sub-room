import { notFound } from 'next/navigation';
import { getServerUser } from '@/lib/supabase/server/auth';
import { getServerSubscriptionById } from '@/lib/supabase/server/subscriptions';
import Header from '../../_components/Header';
import SubscriptionDetail from './_components/SubscriptionDetail';

interface PageProps {
  params: Promise<{ id: string[] }>;
}

export default async function SubscriptionDetailPage({ params }: PageProps) {
  const user = await getServerUser();
  const { id } = await params;
  const subscriptionId = id[0]; // [...id]에서 첫 번째 요소 가져오기

  const subscription = await getServerSubscriptionById(subscriptionId);

  if (!subscription) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <SubscriptionDetail subscription={subscription} />
      </main>
    </div>
  );
}
