import { createContext } from 'react';
import type { Credentials, User } from './types';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (c: Credentials) => Promise<void>;
  register: (c: Credentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
