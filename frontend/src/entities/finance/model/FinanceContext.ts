import { createContext } from 'react';
import type { LoadStatus } from '../../../shared/api/simulateRequest';
import type { Budget, NewBudget } from '../../budget';
import type { Category, NewCategory } from '../../category';
import type { NewTransaction, Transaction } from '../../transaction';

export interface FinanceContextValue {
  status: LoadStatus;
  error: string | null;
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  reload: () => void;
  addTransaction: (data: NewTransaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (data: NewCategory) => void;
  addBudget: (data: NewBudget) => void;
}

export const FinanceContext = createContext<FinanceContextValue | null>(null);
