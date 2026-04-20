import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setToken, getToken } from '../api/client';

type User = { id: number; email: string; full_name: string; role: 'user' | 'organizer' };
type Ctx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<Ctx>({} as Ctx);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        try { setUser(await api.me()); } catch { await setToken(null); }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    await setToken(res.token);
    setUser(res.user);
  };
  const register = async (payload: any) => {
    const res = await api.register(payload);
    await setToken(res.token);
    setUser(res.user);
  };
  const logout = async () => { await setToken(null); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
