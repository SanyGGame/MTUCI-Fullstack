export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon?: string | null;
}

export type NewCategory = Omit<Category, 'id'>;
