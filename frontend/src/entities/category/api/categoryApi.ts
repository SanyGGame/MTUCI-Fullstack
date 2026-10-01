import { request } from '../../../shared/api/http';
import type { Category, NewCategory } from '../model/types';

export const categoryApi = {
  list: () => request<Category[]>('/categories'),
  create: (data: NewCategory) => request<Category>('/categories', { method: 'POST', body: data }),
  update: (id: string, data: Partial<NewCategory>) =>
    request<Category>(`/categories/${id}`, { method: 'PATCH', body: data }),
  remove: (id: string) => request<unknown>(`/categories/${id}`, { method: 'DELETE' }),
};
