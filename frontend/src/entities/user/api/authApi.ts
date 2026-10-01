import { request } from '../../../shared/api/http';
import type { Credentials, User } from '../model/types';

interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export const authApi = {
  register: (c: Credentials) => request<User>('/auth/register', { method: 'POST', body: c, auth: false }),
  login: (c: Credentials) => request<TokenPair>('/auth/login', { method: 'POST', body: c, auth: false }),
  me: () => request<User>('/auth/me'),
  logout: (refreshToken: string) =>
    request<void>('/auth/logout', { method: 'POST', body: { refresh_token: refreshToken }, auth: false }),
};
