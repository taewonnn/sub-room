

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            구독 서비스 관리
          </h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            내 구독 서비스
          </h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            + 추가
          </button>
        </div>

      </main>
    </div>
  );
}
