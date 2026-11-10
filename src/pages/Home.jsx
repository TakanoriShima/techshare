import { useEffect, useState } from 'react';
import ArticleCard from '../components/organisms/ArticleCard';

// 記事一覧ページ
export default function Home() {
  // 「データ」「ローディング状態」「エラー状態」の3つを State で管理する
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // useEffect の関数自体には async を付けられないため、中で非同期関数を定義して呼び出す
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/articles`);
        if (!response.ok) throw new Error('エラーが発生しました');
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        console.error(err); // 原因を開発者ツールのコンソールで確認できるようにする
        setError('記事の取得に失敗しました');
      } finally {
        // 成功・失敗に関わらず、最後にローディングを終える
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []); // 空の配列 [] で初回表示時のみ実行する

  if (isLoading) return <p className="text-gray-500">読み込み中...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
      {articles.length === 0 && (
        <p className="text-gray-500">記事が見つかりません。</p>
      )}
    </div>
  );
}
