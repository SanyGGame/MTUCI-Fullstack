import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AUTH_LOST_EVENT, tokenStorage } from '../../../shared/api/http';
import { authApi } from '../api/authApi';
import { AuthContext } from './AuthContext';
import type { Credentials, User } from './types';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(() => !!tokenStorage.refresh);

  useEffect(() => {
    if (!tokenStorage.refresh) return;
    authApi
      .me()
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onLost = () => setUser(null);
    window.addEventListener(AUTH_LOST_EVENT, onLost);
    return () => window.removeEventListener(AUTH_LOST_EVENT, onLost);
  }, []);

  const login = useCallback(async (c: Credentials) => {
    const tokens = await authApi.login(c);
    tokenStorage.set(tokens.access_token, tokens.refresh_token);
    setUser(await authApi.me());
  }, []);

  const register = useCallback(
    async (c: Credentials) => {
      await authApi.register(c);
      await login(c);
    },
    [login],
  );

  const logout = useCallback(async () => {
    const refresh = tokenStorage.refresh;
    tokenStorage.clear();
    setUser(null);
    if (refresh) await authApi.logout(refresh).catch(() => {});
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
