import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// 全ページ共通のヘッダーを持つテンプレート
export default function Layout() {
  const { user, login, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">TechShare</Link>
          <div className="flex items-center gap-4">
            {/* ログイン状態によってヘッダーを切り替える */}
            {user ? (
              <>
                <span className="text-sm text-gray-600">ようこそ、{user.name}さん</span>
                <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">記事を書く</Link>
                <button onClick={logout} className="text-gray-500 hover:text-gray-800">ログアウト</button>
              </>
            ) : (
              <button onClick={login} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">ログイン</button>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* URLに応じて Home / Article / Editor がここに表示される */}
        <Outlet />
      </main>
    </div>
  );
}
