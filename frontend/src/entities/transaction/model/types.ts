import type { TransactionType } from '../../category';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  description: string;
}

export type NewTransaction = Omit<Transaction, 'id' | 'type'>;
