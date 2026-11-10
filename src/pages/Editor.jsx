import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';

// 記事作成ページ（編集は工程6で実装する）
export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // URLに id があれば編集モード（/edit/:id）、なければ作成モード（/create）
  const isEditMode = Boolean(id);

  // 入力欄の値を State で管理する（制御されたコンポーネント）
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 保存中は二重送信を防ぐ
  const [submitError, setSubmitError] = useState(null);

  // 未ログインならトップページへリダイレクト（作成・編集ともにログインが必要）
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // フォーム送信によるページのリロードを止める
    if (isEditMode || isSubmitting) return; // 編集画面からは保存しない（工程6で実装）・二重送信を防ぐ
    // 空白だけの入力も空として扱う
    if (!title.trim() || !content.trim()) return alert('タイトルと本文を入力してください');

    const articleData = {
      title: title.trim(),
      content: content.trim(),
      author: user.name,
      createdAt: new Date().toISOString().split('T')[0], // 例："2026-05-14"
    };

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });
      if (!response.ok) throw new Error('エラーが発生しました');
      navigate('/'); // 投稿できたら記事一覧へ戻る
    } catch (err) {
      console.error(err);
      setSubmitError('記事の投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 編集機能は工程6で実装する（それまでは仮表示）
  if (isEditMode) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800">記事の編集（工程6で実装）</h1>
        <p className="mt-2 text-gray-600">記事ID：{id}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:h-[80vh]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">新規記事作成</h1>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold disabled:opacity-50"
        >
          {isSubmitting ? '投稿中...' : '投稿する'}
        </button>
      </div>

      {submitError && <p className="text-red-600">{submitError}</p>}

      <input
        type="text"
        placeholder="記事のタイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-3 text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
      />

      {/* エディタとプレビュー（PCでは左右、スマートフォンでは上下に並べる） */}
      <div className="flex flex-col md:flex-row flex-1 gap-6 min-h-0">
        <textarea
          placeholder="マークダウンで本文を記述..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 min-h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
        />
        <div className="flex-1 min-h-64 p-4 border rounded-lg bg-white overflow-y-auto prose max-w-none">
          {content ? <ReactMarkdown>{content}</ReactMarkdown> : <p className="text-gray-400">プレビュー領域</p>}
        </div>
      </div>
    </form>
  );
}
