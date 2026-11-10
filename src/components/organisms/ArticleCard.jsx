import { Link } from 'react-router-dom';

// 記事1件分のカード（Props で article を受け取って表示するだけ）
export default function ArticleCard({ article }) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition"
    >
      <h2 className="text-xl font-bold mb-2 text-gray-800">{article.title}</h2>
      <p className="text-gray-500 text-sm mb-4">
        {article.author} ・ {article.createdAt}
      </p>
      {/* 本文の冒頭だけを3行で表示する */}
      <p className="text-gray-600 line-clamp-3">{article.content}</p>
    </Link>
  );
}
