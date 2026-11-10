import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/templates/Layout';
import Home from './pages/Home';
import Article from './pages/Article';
import Editor from './pages/Editor';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="articles/:id" element={<Article />} />
            {/* key を分けて、作成画面と編集画面を別の部品として扱う（入力内容が引き継がれないようにする） */}
            <Route path="create" element={<Editor key="create" />} />
            <Route path="edit/:id" element={<Editor key="edit" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
