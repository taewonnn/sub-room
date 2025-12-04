import { getServerUser } from '@/lib/supabase/server/auth';
import Header from './_components/Header';
import SubscriptionList from '@/components/subscription/SubscriptionList';

export default async function Home() {
  const user = await getServerUser();
  console.log('user', user);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header user={user} />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">내 구독 서비스</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">+ 추가</button>
        </div>
        <SubscriptionList />
      </main>
    </div>
  );
}
