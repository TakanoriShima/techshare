import { useParams } from 'react-router-dom';

// 記事詳細ページ（仮表示。工程4で実装する）
export default function Article() {
  // URLの :id 部分を取り出す（値は文字列）
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">記事詳細（工程4で実装）</h1>
      <p className="mt-2 text-gray-600">記事ID：{id}</p>
    </div>
  );
}
