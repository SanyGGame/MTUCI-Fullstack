export interface Budget {
  id: string;
  categoryId: string;
  month: string;
  monthlyLimit: number;
  spent: number;
}

export interface NewBudget {
  categoryId: string;
  monthlyLimit: number;
}
