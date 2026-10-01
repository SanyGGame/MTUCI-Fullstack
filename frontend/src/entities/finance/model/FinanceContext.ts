import { createContext } from 'react';
import type { LoadStatus } from '../../../shared/api/status';
import type { Budget, NewBudget } from '../../budget';
import type { Category, NewCategory } from '../../category';
import type { NewTransaction, Transaction } from '../../transaction';
import type { MonthlySummary } from '../api/summaryApi';

export interface FinanceContextValue {
  status: LoadStatus;
  error: string | null;
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  summary: MonthlySummary[];
  reload: () => void;
  addTransaction: (data: NewTransaction) => Promise<void>;
  updateTransaction: (id: string, data: NewTransaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (data: NewCategory) => Promise<void>;
  updateCategory: (id: string, data: Partial<NewCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBudget: (data: NewBudget) => Promise<void>;
  updateBudget: (id: string, monthlyLimit: number) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

export const FinanceContext = createContext<FinanceContextValue | null>(null);
