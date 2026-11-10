import { createContext, useState, useContext } from 'react';

// ログイン状態を入れる「器」を作る
const AuthContext = createContext();

// 子コンポーネント全体にログイン状態を提供する
export function AuthProvider({ children }) {
  // null = 未ログイン
  const [user, setUser] = useState(null);

  // 学習用の簡易ログイン（ボタンを押すと Tech Taro としてログインする）
  const login = () => setUser({ name: 'Tech Taro' });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// どのコンポーネントからでも user / login / logout を取り出せるカスタムフック
export const useAuth = () => useContext(AuthContext);
