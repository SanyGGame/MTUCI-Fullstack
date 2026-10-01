export interface Budget {
  id: string;
  categoryId: string;
  monthlyLimit: number;
}

export interface BudgetProgress extends Budget {
  spent: number;
}

export type NewBudget = Omit<Budget, 'id'>;
