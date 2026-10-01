import type { Budget, BudgetProgress } from '../../budget';
import type { Category } from '../../category';
import type { Transaction } from '../../transaction';

export function sumByCategory(transactions: Transaction[], categoryId: string): number {
  return transactions
    .filter((t) => t.categoryId === categoryId)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function monthTotals(transactions: Transaction[], month: string) {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (!t.date.startsWith(month)) continue;
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, balance: income - expense };
}

export function budgetsWithSpent(
  budgets: Budget[],
  transactions: Transaction[],
  month: string,
): BudgetProgress[] {
  return budgets.map((b) => ({
    ...b,
    spent: transactions
      .filter((t) => t.type === 'expense' && t.categoryId === b.categoryId && t.date.startsWith(month))
      .reduce((sum, t) => sum + t.amount, 0),
  }));
}

export function sortByDateDesc(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => b.date.localeCompare(a.date));
}

export function findCategory(categories: Category[], id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
