import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';

// 記事の作成・編集ページ（1つのコンポーネントで両方を兼ねる）
export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // URLに id があれば編集モード（/edit/:id）、なければ作成モード（/create）
  const isEditMode = Boolean(id);

  // 入力欄の値を State で管理する（制御されたコンポーネント）
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [article, setArticle] = useState(null); // 編集する記事（投稿者の確認に使う）
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // 保存中は二重送信を防ぐ
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    // 未ログインならトップページへリダイレクト（作成・編集ともにログインが必要）
    if (!user) {
      navigate('/');
      return;
    }

    // 作成モードでは記事を取得しない
    if (!isEditMode) return;

    // 編集モードのときだけ、既存の記事を取得してフォームに入れる
    const fetchArticle = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/articles/${id}`);
        if (!response.ok) throw new Error('エラーが発生しました');
        const data = await response.json();
        // 投稿者本人でなければ編集させずにトップページへ戻す
        if (data.author !== user.name) {
          navigate('/');
          return;
        }
        setArticle(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        console.error(err);
        setLoadError('記事を読み込めませんでした。記事が存在しないか、通信に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id, isEditMode, user, navigate]);

  // 編集できるのは、取得した記事の投稿者とログインユーザーが一致するときだけ
  const isOwner = Boolean(article && user && article.author === user.name);

  const handleSubmit = async (e) => {
    e.preventDefault(); // フォーム送信によるページのリロードを止める
    if (isSubmitting) return; // 二重送信を防ぐ
    if (isEditMode && !isOwner) return; // 他人の記事は更新しない
    // 空白だけの入力も空として扱う
    if (!title.trim() || !content.trim()) return alert('タイトルと本文を入力してください');

    // 作成時は4項目、編集時はタイトルと本文だけを送る（作成日 createdAt は変えない）
    const articleData = isEditMode
      ? { title: title.trim(), content: content.trim() }
      : {
          title: title.trim(),
          content: content.trim(),
          author: user.name,
          createdAt: new Date().toISOString().split('T')[0], // 例："2026-05-14"
        };
    const url = isEditMode
      ? `${import.meta.env.VITE_API_URL}/articles/${id}`
      : `${import.meta.env.VITE_API_URL}/articles`;
    const method = isEditMode ? 'PATCH' : 'POST';

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });
      if (!response.ok) throw new Error('エラーが発生しました');
      navigate('/'); // 保存できたら記事一覧へ戻る
    } catch (err) {
      console.error(err);
      setSubmitError(isEditMode ? '記事の更新に失敗しました' : '記事の投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 未ログインのときはフォームを表示しない（トップページへのリダイレクトは useEffect で行う）
  if (!user) return null;

  // 編集モードでは、記事の読み込みと本人確認が終わるまでフォームを表示しない
  if (isEditMode) {
    if (isLoading) return <p className="text-gray-500">読み込み中...</p>;
    if (loadError) {
      return (
        <div>
          <p className="text-red-600">{loadError}</p>
          <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline">← 記事一覧へ戻る</Link>
        </div>
      );
    }
    if (!isOwner) return null;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:h-[80vh]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{isEditMode ? '記事の編集' : '新規記事作成'}</h1>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold disabled:opacity-50"
        >
          {isSubmitting
            ? (isEditMode ? '更新中...' : '投稿中...')
            : (isEditMode ? '更新する' : '投稿する')}
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
