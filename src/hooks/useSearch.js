import { useState, useMemo } from 'react';

// 記事の検索ロジックをまとめたカスタムフック
// 引数：initialArticles（全記事の配列）
// 戻り値：{ searchQuery（検索ワード）, setSearchQuery（検索ワードを更新する関数）, filteredArticles（絞り込み後の記事配列） }
export function useSearch(initialArticles) {
  const [searchQuery, setSearchQuery] = useState('');

  // searchQuery か initialArticles が変わったときだけ再計算する
  const filteredArticles = useMemo(() => {
    // 前後の空白を取り除き、小文字にそろえて比べる（大文字・小文字を区別しない）
    const lowerQuery = searchQuery.trim().toLowerCase();
    if (!lowerQuery) return initialArticles; // 検索ワードが空なら全件

    // filter は新しい配列を返すので、元の記事配列は変更されない
    return initialArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.content.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, initialArticles]);

  return { searchQuery, setSearchQuery, filteredArticles };
}
