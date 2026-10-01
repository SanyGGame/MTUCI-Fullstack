import type { FormErrors } from '../../../shared/lib/validation';
import type { Category, TransactionType } from '../../../entities/category';

export interface CategoryFormValues {
  name: string;
  type: TransactionType;
  color: string;
}

export const CATEGORY_COLORS = [
  '#2D5F4C', '#4C8069', '#B8452F', '#C97B4A',
  '#9C3B2E', '#D19A6A', '#3F6C9E', '#8A8577',
];

export function validateCategory(
  v: CategoryFormValues,
  categories: Category[],
): FormErrors<CategoryFormValues> {
  const errors: FormErrors<CategoryFormValues> = {};
  const name = v.name.trim();

  if (!name) errors.name = 'Введите название';
  else if (name.length > 100) errors.name = 'Не более 100 символов';
  else if (categories.some((c) => c.type === v.type && c.name.toLowerCase() === name.toLowerCase())) {
    errors.name = 'Такая категория уже есть';
  }

  if (!/^#[0-9A-Fa-f]{6}$/.test(v.color)) errors.color = 'Выберите цвет';

  return errors;
}
