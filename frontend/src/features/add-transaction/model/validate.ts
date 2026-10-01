import { validateMoney, type FormErrors } from '../../../shared/lib/validation';
import type { Category, TransactionType } from '../../../entities/category';

export interface TransactionFormValues {
  type: TransactionType;
  amount: string;
  date: string;
  categoryId: string;
  description: string;
}

export function validateTransaction(
  v: TransactionFormValues,
  categories: Category[],
): FormErrors<TransactionFormValues> {
  const errors: FormErrors<TransactionFormValues> = {};

  errors.amount = validateMoney(v.amount);

  if (!v.date) errors.date = 'Укажите дату';
  else if (v.date < '2000-01-01' || v.date > '2100-01-01') errors.date = 'Введите корректную дату';

  if (!v.categoryId) errors.categoryId = 'Выберите категорию';
  else if (!categories.some((c) => c.id === v.categoryId && c.type === v.type)) {
    errors.categoryId = 'Категория не подходит для выбранного типа';
  }

  if (v.description.trim().length > 255) errors.description = 'Не более 255 символов';

  return errors;
}
