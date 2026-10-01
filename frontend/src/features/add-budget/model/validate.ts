import { validateMoney, type FormErrors } from '../../../shared/lib/validation';

export interface BudgetFormValues {
  categoryId: string;
  limit: string;
}

export function validateBudget(v: BudgetFormValues): FormErrors<BudgetFormValues> {
  return {
    categoryId: v.categoryId ? undefined : 'Выберите категорию',
    limit: validateMoney(v.limit, 'Лимит'),
  };
}
