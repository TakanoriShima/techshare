// 検索欄（Props で検索ワードと、変更を親に知らせる関数を受け取る）
export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="記事を検索..."
      aria-label="記事を検索"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
