import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// 記事作成・編集ページ（仮表示。工程5・6で実装する）
export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // URLに id があれば編集モード（/edit/:id）、なければ作成モード（/create）
  const isEditMode = Boolean(id);

  // 未ログインならトップページへリダイレクト（作成・編集ともにログインが必要）
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        {isEditMode ? '記事の編集' : '新規記事作成'}（工程5・6で実装）
      </h1>
      {isEditMode && <p className="mt-2 text-gray-600">記事ID：{id}</p>}
    </div>
  );
}
