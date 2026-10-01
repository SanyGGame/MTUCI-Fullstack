import { request } from '../../../shared/api/http';
import { CURRENT_MONTH } from '../../../shared/config';
import type { Budget, NewBudget } from '../model/types';

interface BudgetDto {
  id: string;
  category_id: string;
  month: string;
  monthly_limit: string;
  spent: string;
}

const toBudget = (d: BudgetDto): Budget => ({
  id: d.id,
  categoryId: d.category_id,
  month: d.month,
  monthlyLimit: Number(d.monthly_limit),
  spent: Number(d.spent),
});

const monthStart = `${CURRENT_MONTH}-01`;

export const budgetApi = {
  list: async () => (await request<BudgetDto[]>(`/budgets?month=${monthStart}`)).map(toBudget),
  create: async (d: NewBudget) =>
    toBudget(
      await request<BudgetDto>('/budgets', {
        method: 'POST',
        body: { category_id: d.categoryId, month: monthStart, monthly_limit: d.monthlyLimit },
      }),
    ),
  update: async (id: string, monthlyLimit: number) =>
    toBudget(await request<BudgetDto>(`/budgets/${id}`, { method: 'PATCH', body: { monthly_limit: monthlyLimit } })),
  remove: (id: string) => request<unknown>(`/budgets/${id}`, { method: 'DELETE' }),
};
