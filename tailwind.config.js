import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  // srcフォルダ内のすべてのReactファイルを監視対象にする
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  // 記事本文のMarkdownを整形する prose クラスを使うためのプラグイン
  plugins: [typography],
}
