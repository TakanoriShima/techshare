import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';

// 記事詳細ページ
export default function Article() {
  const { id } = useParams(); // URLの :id 部分（値は文字列）
  const navigate = useNavigate();
  const { user } = useAuth();

  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // 削除中はボタンを押せなくする
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/articles/${id}`);
        if (!response.ok) throw new Error('エラーが発生しました');
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        console.error(err);
        setError('記事を表示できませんでした。記事が存在しないか、通信に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]); // id が変わるたびに記事を取得し直す

  const handleDelete = async () => {
    // 「キャンセル」を押したら、ここで処理を終える
    if (!window.confirm('この記事を削除しますか？')) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/articles/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('エラーが発生しました');
      navigate('/'); // 削除できたら記事一覧へ戻る
    } catch (err) {
      console.error(err);
      setDeleteError('記事の削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <p className="text-gray-500">読み込み中...</p>;
  if (error) {
    return (
      <div>
        <p className="text-red-600">{error}</p>
        <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline">← 記事一覧へ戻る</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="inline-block mb-4 text-blue-600 hover:underline">← 記事一覧へ戻る</Link>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div className="text-gray-500">
            <span>{article.author}</span>
            <span className="mx-2">・</span>
            <span>{article.createdAt}</span>
          </div>

          {/* ログイン中 かつ 投稿者本人 のときだけ表示する */}
          {user && user.name === article.author && (
            <div className="flex gap-2">
              <Link
                to={`/edit/${id}`}
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
              >
                編集
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 disabled:opacity-50"
              >
                {isDeleting ? '削除中...' : '削除'}
              </button>
            </div>
          )}
        </div>

        {deleteError && <p className="mb-4 text-red-600">{deleteError}</p>}

        {/* react-markdown で本文を HTML に変換し、prose クラスで読みやすく整える */}
        <div className="prose max-w-none">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
