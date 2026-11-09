// 工程0の環境確認用の画面（工程2でルーティングを設定する際に置き換える）
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-blue-600">TechShare</h1>
        <p className="mt-2 text-gray-600">Tailwind CSS v3 の動作確認</p>

        <div className="prose mt-6 bg-white p-6 rounded-lg shadow-sm">
          <h2>見出し（prose の確認）</h2>
          <ul>
            <li>リスト1</li>
            <li>リスト2</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
