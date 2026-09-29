export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  description: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  monthlyLimit: number;
  spent: number;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
}
