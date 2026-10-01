import { request } from '../../../shared/api/http';
import type { NewTransaction, Transaction } from '../model/types';

interface TransactionDto {
  id: string;
  date: string;
  amount: string;
  type: Transaction['type'];
  description: string;
  category_id: string;
}

const toTransaction = (d: TransactionDto): Transaction => ({
  id: d.id,
  date: d.date,
  amount: Number(d.amount),
  type: d.type,
  categoryId: d.category_id,
  description: d.description,
});

const toBody = (d: NewTransaction) => ({
  date: d.date,
  amount: d.amount,
  category_id: d.categoryId,
  description: d.description,
});

export const transactionApi = {
  list: async () => (await request<TransactionDto[]>('/transactions')).map(toTransaction),
  create: async (d: NewTransaction) =>
    toTransaction(await request<TransactionDto>('/transactions', { method: 'POST', body: toBody(d) })),
  update: async (id: string, d: NewTransaction) =>
    toTransaction(await request<TransactionDto>(`/transactions/${id}`, { method: 'PATCH', body: toBody(d) })),
  remove: (id: string) => request<unknown>(`/transactions/${id}`, { method: 'DELETE' }),
};
