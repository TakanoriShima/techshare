# TechShare（技術ナレッジ共有アプリ）

エンジニアが学んだ技術を Markdown で記事にまとめ、一覧・検索・閲覧できる Web アプリです。
React の学習成果として、記事の作成・編集・削除（CRUD）、ログイン状態の共有、検索、公開までを一通り実装しました。

## デモ

| 種類 | URL |
| --- | --- |
| アプリ（Vercel） | https://techshare-v33o.vercel.app |
| API（Render） | https://techshare-zysk.onrender.com/articles |
| GitHub | https://github.com/TakanoriShima/techshare |

> API は Render の無料プランで動いています。しばらくアクセスがないと停止するため、最初の表示に 30 秒ほどかかることがあります。

## アプリの概要

### 主な機能

| 機能 | 内容 |
| --- | --- |
| 記事一覧 | 記事をカード形式で表示します（PC では 2 列、スマートフォンでは 1 列） |
| 記事詳細 | 本文を Markdown として整形して表示します（見出し・リストなど） |
| 記事検索 | タイトルと本文を対象に、入力と同時に絞り込みます。大文字・小文字は区別しません。0 件のときは「記事が見つかりません。」と表示します |
| ログイン・ログアウト | ヘッダーのボタンで切り替えます（課題用の簡易ログイン。「補足・注意事項」を参照） |
| 記事作成 | タイトルと Markdown の本文を入力し、右側（スマートフォンでは下側）のプレビューで仕上がりを確認しながら投稿します |
| 記事編集 | 既存のタイトル・本文を読み込んで編集します。更新しても作成日は変わりません |
| 記事削除 | 確認ダイアログで「OK」を押したときだけ削除します |

### ログインの有無でできること

| 操作 | 未ログイン | ログイン中 |
| --- | --- | --- |
| 記事一覧・詳細の閲覧 | できる | できる |
| 記事検索 | できる | できる |
| 記事作成（`/create`） | できない（トップページに戻ります） | できる |
| 記事の編集・削除 | できない（ボタンを表示しません） | 自分が投稿した記事だけできる |

### 画面とURL

| 画面 | URL |
| --- | --- |
| 記事一覧 | `/` |
| 記事詳細 | `/articles/:id` |
| 記事作成 | `/create` |
| 記事編集 | `/edit/:id` |

## 技術スタックと選んだ理由

| 技術 | 役割 | 選んだ理由 |
| --- | --- | --- |
| React 19 | 画面の構築 | ヘッダー・記事カード・検索欄などを部品（コンポーネント）として分け、同じ部品を複数の画面で使い回せるため |
| Vite 8 | 開発サーバー・ビルド | コマンド1つで React の開発環境を作れ、保存するとすぐ画面に反映されて開発しやすいため |
| React Router 7（react-router-dom） | 画面遷移 | ページを再読み込みせずに一覧・詳細・作成・編集を切り替えられ、`/articles/:id` のように URL から記事 ID を受け取れるため |
| Tailwind CSS 3 | 見た目の調整 | クラス名を組み合わせるだけでスタイルを当てられ、CSS ファイルを行き来せずに済むため。`md:` でスマートフォンと PC の表示も切り替えられます |
| @tailwindcss/typography | Markdown の整形 | `prose` クラスだけで、Markdown から変換した見出しやリストを読みやすく表示できるため |
| react-markdown | Markdown の表示 | 記事本文の Markdown を React の画面で HTML として表示でき、プレビューにもそのまま使えるため |
| JSON Server | API サーバー | `db.json` を用意するだけで REST API（取得・作成・更新・削除）を用意でき、フロントエンドの実装に集中できるため |
| Vercel / Render | 公開 | Vercel は React（静的ファイル）の公開、Render は JSON Server のようなサーバーの公開に向いているため、役割ごとに分けました |

### API（JSON Server）

| メソッド | URL | 操作 |
| --- | --- | --- |
| GET | `/articles` | 記事を全件取得 |
| GET | `/articles/:id` | 記事を 1 件取得 |
| POST | `/articles` | 記事を作成 |
| PATCH | `/articles/:id` | 記事を更新 |
| DELETE | `/articles/:id` | 記事を削除 |

記事のデータ項目は `id`・`title`・`content`（Markdown）・`author`・`createdAt` の 5 つです。
機能一覧・データ項目・API の設計は [docs/requirements.md](docs/requirements.md) にまとめています。

## 工夫した点

- **ログイン状態を Context API で共有**
  ログイン状態（`user`）を `src/contexts/AuthContext.jsx` にまとめ、`useAuth()` でヘッダー・記事詳細・記事作成のどこからでも取り出せるようにしました。親から子へ何階層も props で受け渡す必要がなくなりました。
- **検索処理をカスタムフックに分離し、useMemo で再計算を減らした**
  検索ワードの管理と絞り込みを `src/hooks/useSearch.js` に分け、画面（`Home.jsx`）には表示だけを残しました。絞り込み結果は `useMemo` で、検索ワードか記事一覧が変わったときだけ計算し直します。前後の空白を取り除き、小文字にそろえてから比べるので、「REACT」でも「react」を含む記事が見つかります。
- **入力と同時に更新される Markdown プレビュー**
  本文の入力欄を State で管理し、その値をそのまま `react-markdown` に渡すことで、入力中に仕上がりを確認できるようにしました。
- **作成と編集を 1 つの画面で共通化**
  `Editor.jsx` は URL に `id` があるかどうかで作成・編集を切り替え、見出し・ボタン・送信方法（POST / PATCH）を変えています。編集では `title` と `content` だけを送るので、作成日（`createdAt`）は変わりません。
- **通信中・失敗時の表示**
  データ取得では「読み込み中...」と、失敗時のメッセージを表示します。保存中・削除中はボタンを押せなくして、二重送信を防いでいます。
- **ログイン状態による表示の制御**
  未ログインで作成・編集ページを開くと、フォームを表示せずにトップページへ戻します。編集・削除ボタンは、ログイン中のユーザー名と記事の投稿者が一致するときだけ表示します。
- **Atomic Design の考え方でコンポーネントを整理**
  共通レイアウト（`templates/Layout.jsx`）、記事カード（`organisms/ArticleCard.jsx`）、検索欄（`molecules/SearchBar.jsx`）を役割ごとに分けました。細かく分けすぎず、必要な部品だけを切り出しています。
- **フロントエンドと API を分けて公開**
  API の URL は環境変数 `VITE_API_URL` で切り替え、ソースコードに URL を直接書かないようにしました。Vercel で詳細ページを再読み込みしても表示できるよう、`vercel.json` を設定しています。

## 難しかった点

- **作成日を変えずに更新すること**
  作成と編集で同じ画面を使うため、更新時にどの項目を送るかを分ける必要がありました。PATCH では `title` と `content` だけを送ることで解決しました。
- **作成画面と編集画面の入力内容が混ざること**
  同じ `Editor` を 2 つの URL で使っているため、そのままでは編集画面から「記事を書く」に移ったときに、編集中の内容が残ってしまう問題がありました。`App.jsx` で `key` を分け、別の部品として作り直されるようにしました。
- **useEffect の中での非同期処理**
  `useEffect` の関数には直接 `async` を付けられないため、中で非同期関数を定義して呼び出し、`try` / `catch` / `finally` で読み込み中とエラーの状態を管理しました。
- **JSON Server の動作確認**
  記事を作成・更新すると `db.json` そのものが書き換わるため、動作確認のたびに初期データへ戻す手順が必要でした。

## ローカルでの起動手順

### 必要な環境

- Node.js 22.12 以上（JSON Server 1.0.0-beta.15 と Vite 8 の動作条件）
- npm

### 手順

```bash
# 1. リポジトリを取得して移動
git clone https://github.com/TakanoriShima/techshare.git
cd techshare

# 2. 依存パッケージをインストール
npm install

# 3. 環境変数ファイルを作成（API の URL を設定）
cp .env.example .env        # Windows のコマンドプロンプトでは: copy .env.example .env
```

`.env` の中身は次の 1 行です（`.env.example` と同じ）。

```env
VITE_API_URL=http://localhost:3000
```

ターミナルを 2 つ開き、それぞれで次のコマンドを実行します。

```bash
# ターミナル1：API サーバー（JSON Server）を起動 → http://localhost:3000/articles
npm run server
```

```bash
# ターミナル2：フロントエンドの開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:5173 を開くと、記事一覧が表示されます。

### その他のコマンド

| コマンド | 内容 |
| --- | --- |
| `npm run build` | 公開用のファイルを `dist/` に作成 |
| `npm run preview` | 作成した公開用ファイルをローカルで確認 |
| `npm run lint` | コードのチェック（Oxlint） |

## ゼロからTechShareを構築する手順

ここでは、空の状態から TechShare と同じ構成のアプリを作る流れを説明します。
すでにあるこのリポジトリを動かすだけなら、上の「ローカルでの起動手順」（`git clone`）を使ってください。

> **注意**
> - コマンドだけで完成するのは「環境づくり」までです。画面や機能は、手順 10 のとおり自分でコードを書く必要があります（完成形のコードは、このリポジトリの `src/` 以下にあります）。
> - バージョンは、このリポジトリで実際に使っているもの（`package.json`・`package-lock.json`）に合わせています。`npm create vite@latest` などは実行した時期によって最新版が変わり、質問の内容や生成されるファイルが変わることがあります。
> - コマンドは、Windows の PowerShell・コマンドプロンプト、Mac のターミナルのどれでも同じものが使えます。違う場合は個別に書いています。

### このリポジトリで使っているバージョン

| パッケージ | バージョン | 区分 |
| --- | --- | --- |
| react / react-dom | 19.3.1 | dependencies |
| react-router-dom | 7.18.5 | dependencies |
| react-markdown | 10.1.0 | dependencies |
| vite | 8.3.7 | devDependencies |
| tailwindcss | 3.4.19（v3 系） | devDependencies |
| postcss / autoprefixer | 8.5.32 / 10.6.2 | devDependencies |
| @tailwindcss/typography | 0.5.20 | devDependencies |
| json-server | 1.0.0-beta.15（バージョン固定） | devDependencies |
| oxlint | 1.93.0 | devDependencies |

### 1. Node.js と npm を準備する

**目的**：Vite・React・JSON Server を動かすための実行環境を用意します。

Node.js の公式サイトからインストールし、バージョンを確認します。Vite 8 と JSON Server 1.0.0-beta.15 は **Node.js 22.12 以上** が必要です（npm は Node.js と一緒に入ります）。

```bash
# 実行場所：どこでも可
node -v
npm -v
```

### 2. Vite で React プロジェクトを作る

**目的**：React の開発に必要なファイル一式を自動で作ります。

```bash
# 実行場所：プロジェクトを置きたいフォルダ（例：ドキュメントなど）
npm create vite@latest techshare
```

画面の質問には次のように答えます（create-vite 9.3.4 の場合）。

| 質問 | 選ぶもの |
| --- | --- |
| Select a framework | React |
| Select a variant | JavaScript |
| Which linter to use? | Oxlint（このリポジトリと同じ。ESLint を選ぶと `lint` のコマンドと設定ファイルが変わります） |
| Install with npm and start now? | No（この後の手順で自分でインストールします） |

`techshare` フォルダの中に `package.json`・`index.html`・`vite.config.js`・`src/` などが作られます。

### 3. プロジェクトのフォルダへ移動する

```bash
# 実行場所：手順 2 と同じフォルダ
cd techshare
```

**これ以降のコマンドは、すべて `techshare` フォルダの中で実行します。**

### 4. 依存パッケージをインストールする

**目的**：テンプレートに書かれている React・Vite などを `node_modules` に入れます。

```bash
# 実行場所：techshare
npm install
```

> **`npm install` と `npm ci` の違い**
> - `npm install`：パッケージを入れる・追加するときに使います。`package-lock.json` がなければ作り、必要なら更新します。
> - `npm ci`：`package-lock.json` に書かれたバージョンどおりに、そのまま入れ直します（`package-lock.json` は変更しません）。完成したリポジトリを `git clone` して、作者と同じ環境をそのまま再現したいときに向いています。
> - ゼロから作るこの章では `npm install` を使います。

### 5. 使うライブラリを追加する

**目的**：画面遷移・Markdown 表示・スタイル・API サーバーのライブラリを追加します。

```bash
# 実行場所：techshare
# アプリ本体で使うもの（dependencies）
npm install react-router-dom react-markdown

# 開発時だけ使うもの（devDependencies）：Tailwind CSS v3 と関連パッケージ
npm install -D tailwindcss@3 postcss autoprefixer @tailwindcss/typography

# API サーバー（JSON Server）はバージョンを固定して入れる
npm install -D -E json-server@1.0.0-beta.15
```

- `tailwindcss@3` の `@3` が大切です。付けないと v4 が入り、次の手順の `init` コマンドや設定方法が使えません。
- JSON Server は `npm install -D json-server` だと、その時点の最新版（ベータ版）が入ります。ベータ版は更新で動きが変わることがあるため、`-E`（版を固定）でこのリポジトリと同じ版にしています。

### 6. Tailwind CSS の設定をする

**目的**：Tailwind CSS のクラス名でデザインできるようにします。

```bash
# 実行場所：techshare
npx tailwindcss init -p
```

`tailwind.config.js` と `postcss.config.js` が作られます。続けて、次の3つのファイルを編集します。

| ファイル | 役割 | 書く内容 |
| --- | --- | --- |
| `tailwind.config.js` | Tailwind の設定 | `content` に `"./index.html"` と `"./src/**/*.{js,jsx}"` を書く（クラス名を探す範囲）。`plugins` に `@tailwindcss/typography` を登録する（Markdown を整える `prose` クラスを使うため） |
| `postcss.config.js` | CSS の変換設定 | 自動で作られたまま（`tailwindcss` と `autoprefixer`）でよい |
| `src/index.css` | 全体の CSS | 中身を消して、`@tailwind base;`・`@tailwind components;`・`@tailwind utilities;` の3行だけにする |

テンプレートの見本（`src/App.css`、`src/assets/` の画像、`public/icons.svg`）は使わないので削除して構いません。`src/App.jsx` の見本のコードも、手順 10 で書き換えます。

### 7. フォルダとファイルの構成を準備する

**目的**：Atomic Design の考え方で、役割ごとにファイルを置く場所を決めます。

```text
techshare/
├─ db.json                       … API のデータ（手順 8）
├─ .env / .env.example           … API の接続先（手順 9）
├─ vercel.json                   … Vercel の画面遷移の設定（手順 15）
├─ docs/requirements.md          … 要件定義メモ（機能6・データ項目5・API5）
└─ src/
   ├─ App.jsx                    … ルーティング
   ├─ contexts/AuthContext.jsx   … ログイン状態（useAuth）
   ├─ hooks/useSearch.js         … 検索のカスタムフック（useMemo）
   ├─ components/
   │  ├─ templates/Layout.jsx    … 共通ヘッダー
   │  ├─ organisms/ArticleCard.jsx … 記事カード
   │  └─ molecules/SearchBar.jsx … 検索欄
   └─ pages/
      ├─ Home.jsx                … 記事一覧
      ├─ Article.jsx             … 記事詳細
      └─ Editor.jsx              … 記事作成・編集
```

フォルダは VS Code のエクスプローラーで作ると簡単です。コマンドで作る場合は、使うツールによって書き方が違います。

```powershell
# 実行場所：techshare（Windows の PowerShell）※フォルダ名をカンマで区切る
mkdir docs, src/contexts, src/hooks, src/components/templates, src/components/organisms, src/components/molecules, src/pages
```

```bat
:: 実行場所：techshare（Windows のコマンドプロンプト）※区切りは「\」、フォルダ名は空白で区切る
mkdir docs src\contexts src\hooks src\components\templates src\components\organisms src\components\molecules src\pages
```

```bash
# 実行場所：techshare（Mac のターミナル・Git Bash）※途中のフォルダも作る -p を付ける
mkdir -p docs src/contexts src/hooks src/components/templates src/components/organisms src/components/molecules src/pages
```

### 8. 初期データ（db.json）と API サーバーを準備する

**目的**：JSON Server が読み込む記事データを用意し、API として動かせるようにします。

`techshare` の直下に `db.json` を作ります。記事のデータ項目は `id`・`title`・`content`・`author`・`createdAt` の 5 つで、`id` は文字列です。

```json
{
  "articles": [
    {
      "id": "1",
      "title": "記事のタイトル",
      "content": "## 見出し\n本文（Markdown）",
      "author": "Tech Taro",
      "createdAt": "2026-05-14"
    }
  ]
}
```

- 課題の動作確認には 2 件必要です（「Tech Taro」の記事 1 件と、それ以外の投稿者の記事 1 件。条件は課題の資料を確認してください）。このリポジトリの `db.json` も参考になります。
- 実名・住所・メールアドレスなどの個人情報は入れないでください。

`package.json` の `"scripts"` に、API サーバーを起動するコマンドを 1 行追加します（エディタで編集します）。

```json
"server": "json-server db.json --port 3000"
```

JSON Server 1.0（ベータ版）は、`db.json` の変更を自動で読み込むため `--watch` は不要です。また、画面から記事を作成・更新・削除すると `db.json` そのものが書き換わります（`"$schema"` という行も自動で追加されます）。

### 9. API の接続先を .env に設定する

**目的**：API の URL をソースコードに直接書かず、環境ごとに切り替えられるようにします。

`techshare` の直下に `.env` を作り、次の 1 行を書きます。同じ内容で `.env.example`（他の人に設定例を見せるためのファイル）も作っておきます。

```env
VITE_API_URL=http://localhost:3000
```

コードでは `import.meta.env.VITE_API_URL` で読み込みます（例：`` fetch(`${import.meta.env.VITE_API_URL}/articles`) ``）。Vite は `VITE_` で始まる変数だけを読み込みます。

Vite のテンプレートの `.gitignore` には `.env` が含まれていません。**`.env` を GitHub に公開しないよう、`.gitignore` に次の 3 行を追加してください。**

```text
.env
.env.*
!.env.example
```

### 10. 画面と機能を実装する（コードを書く工程）

**目的**：TechShare の画面と機能を作ります。**この工程はコマンドでは完成しません。** 各ファイルを自分で書き、1 つ作るごとにブラウザで動作を確かめます（起動方法は手順 11）。

このリポジトリでは、次の順番で実装しました。

| 順番 | 作るもの | 主なファイル | 確認すること |
| --- | --- | --- | --- |
| 1 | ログイン状態と共通ヘッダー、画面遷移の設定 | `AuthContext.jsx`、`Layout.jsx`、`App.jsx`（`AuthProvider` → `BrowserRouter` → `Routes` の順に包む） | ログイン・ログアウトでヘッダーが切り替わる |
| 2 | 記事一覧 | `Home.jsx`、`ArticleCard.jsx` | API の記事がカードで表示される |
| 3 | 記事詳細と削除 | `Article.jsx` | Markdown が整形される／本人だけに編集・削除が出る／確認ダイアログの後に削除される |
| 4 | 記事作成 | `Editor.jsx` | 入力と同時にプレビューが変わる／投稿後に一覧へ戻る |
| 5 | 記事編集 | `Editor.jsx`（作成と共通）、`App.jsx` | 既存の内容が入っている／更新しても作成日が変わらない |
| 6 | 検索 | `useSearch.js`、`SearchBar.jsx`、`Home.jsx` | 本文の語でもヒットする／大文字・小文字を区別しない／0 件のメッセージ |

コードの内容は、このリポジトリの各ファイルを参照してください。

### 11. API と React の開発サーバーを起動する

**目的**：作った画面を、API とつないでブラウザで確認します。ターミナルを 2 つ使います。

```bash
# 実行場所：techshare（ターミナル1）
npm run server
```

```bash
# 実行場所：techshare（ターミナル2）
npm run dev
```

- API：http://localhost:3000/articles を開くと、`db.json` の記事が JSON で表示されます。
- 画面：http://localhost:5173 を開きます。
- `.env` を変更したときは、`npm run dev` をいったん止めて（`Ctrl + C`）起動し直してください。

### 12. ブラウザで機能を確認する

課題の動作確認の流れに沿って確認します。

1. 未ログインで記事一覧が表示される
2. 検索：本文だけにある語・大文字小文字を変えた語でヒットし、どの記事にもない語で「記事が見つかりません。」が出る
3. 記事詳細で Markdown が整形され、未ログインでは編集・削除ボタンが出ない
4. 未ログインで http://localhost:5173/create を開くと、トップページに戻される
5. ログインするとヘッダーが「ようこそ、Tech Taroさん」「記事を書く」「ログアウト」になる
6. 記事を作成でき、プレビューが入力に合わせて変わる
7. 記事を編集しても作成日が変わらない
8. 削除の確認でキャンセルすると残り、OK で一覧から消える
9. ログアウトするとヘッダーが元に戻る

> 確認で記事を作成・編集・削除すると `db.json` が書き換わります。初期データに戻してからコミットしてください（Git 管理を始めた後なら `git restore db.json` で戻せます）。

### 13. lint と本番ビルドを確認する

**目的**：公開する前に、コードのチェックと公開用ファイルの作成ができるかを確かめます。

```bash
# 実行場所：techshare
npm run lint       # コードのチェック（Oxlint）
npm run build      # 公開用のファイルを dist/ に作る
npm run preview    # dist/ の内容をローカルで確認する
```

### 14. Git で管理を始め、区切りごとにコミットする

**目的**：作業の履歴を残し、後で GitHub に公開できるようにします。

ゼロから作ったフォルダは、まだ Git のリポジトリではありません。**最初に 1 回だけ** `git init` で初期化します（`git clone` は GitHub にある既存のリポジトリを取得する操作で、ここでは使いません）。

```bash
# 実行場所：techshare（最初の 1 回だけ）
git init -b main
git status          # .env・node_modules・dist が一覧に出ないことを確認する
git add .
git commit -m "React開発環境を構築"
```

> `git init -b main` は Git 2.28 以降で使えます。古い Git の場合は `git init` の後に `git branch -M main` を実行します。

その後は、機能を 1 つ作り、動作を確認できたらコミットします。このリポジトリでは次の単位でコミットしました。

| タイミング | コミットメッセージの例 |
| --- | --- |
| 手順 1〜6 の環境づくりの後 | React開発環境を構築 |
| 手順 8・9 と要件定義メモの後 | 要件定義メモとAPIサーバーを追加 |
| 手順 10 の 1〜6 をそれぞれ終えた後 | 共通レイアウトとログイン機能を追加／記事一覧ページを追加／記事詳細と削除を追加／記事作成ページを追加／記事編集を追加／記事検索を追加 |
| 公開の準備（`vercel.json`）の後 | Vercel設定と未ログイン時の表示を修正 |

コミットする前に、`git status` で `.env` が含まれていないこと、`db.json` が初期データのままであることを確認してください。

### 15. GitHub に公開し、Vercel と Render にデプロイする（概要）

**目的**：インターネット上で誰でも使える状態にします。順番は **GitHub → Render（API）→ Vercel（画面）** です。

**(1) GitHub に公開する**

GitHub で新しいリポジトリを **Public** で作ります。README・.gitignore・LICENSE は **作らない** でください（作ると手元の履歴とぶつかります）。作成後に表示される URL を使って、次を実行します。

```bash
# 実行場所：techshare
git remote add origin https://github.com/<ユーザー名>/<リポジトリ名>.git
git push -u origin main
```

**(2) Render に API（JSON Server）をデプロイする**

Render で「New Web Service」を作り、GitHub のリポジトリをつなぎます。このリポジトリの公開デモでは、次のように設定しています。

| 項目 | 設定 |
| --- | --- |
| Branch | `main` |
| Root Directory | 未指定（リポジトリの直下） |
| Build Command | `npm ci --include=dev` |
| Start Command | `npx --no-install json-server db.json --port 10000` |
| Auto-Deploy | On Commit |

- `npm ci --include=dev`：`package-lock.json` のとおりに同じ版を入れ直し、`devDependencies` にある JSON Server も確実にインストールするためです（npm は本番用の設定では `devDependencies` を省くことがあります）。
- `npx --no-install`：インストール済みの JSON Server（1.0.0-beta.15）だけを使い、見つからない場合にインターネットから別の版を取得して起動しないようにするためです。
- 教材の Start Command にある `--watch` は、JSON Server 1.0 では不要です（ファイルの変更は自動で読み込まれます）。
- Auto-Deploy が On Commit なので、`main` に push するたびに Render も再デプロイされ、`db.json` が初期状態に戻ります。

デプロイ後に表示される URL（例：`https://xxxx.onrender.com`）の `/articles` を開き、記事の JSON が返ることを確認します。

**(3) Vercel に画面（React）をデプロイする**

Vercel で「Add New Project」から GitHub のリポジトリを選び、環境変数を設定してデプロイします。

| 項目 | 設定 |
| --- | --- |
| 環境変数 `VITE_API_URL` | Render の URL（例：`https://xxxx.onrender.com`。最後に `/` を付けない） |

- `VITE_API_URL` はビルドのときに埋め込まれるため、値を変えたら Vercel で **Redeploy** が必要です。
- 記事詳細などのページを開いたまま再読み込みしても 404 にならないよう、`techshare` の直下に `vercel.json` を置きます。

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

公開後は、手順 12 と同じ確認を公開 URL で行います。

## 補足・注意事項

- **ログインは課題用の簡易実装です。**「ログイン」ボタンを押すと、パスワードなしで「Tech Taro」としてログインします。ログイン状態はブラウザのメモリ（React の State）にだけあるため、ページを再読み込みするとログアウトします。
- **編集・削除の制限は画面上だけのものです。** API 側には認証・権限の確認がないため、API を直接呼び出せば誰でも記事を作成・更新・削除できます。実際のサービスでは、サーバー側での認証と権限の確認が必要です。
- **公開デモのデータは誰でも見られ、変更もできます。** 個人情報や秘密にしたい内容は投稿しないでください。
- **Render の無料プランの制約**：しばらくアクセスがないと停止し、最初の表示に 30 秒ほどかかることがあります。また、再起動や再デプロイのたびに `db.json` が初期状態に戻るため、投稿した記事が消えることがあります。
- 一覧の記事カードには本文の冒頭を表示しています。Markdown の記号（`##` など）はそのまま表示され、整形して表示するのは記事詳細と作成・編集のプレビューです。
