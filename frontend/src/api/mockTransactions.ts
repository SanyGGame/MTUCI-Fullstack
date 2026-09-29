import type { Transaction } from '../types';

export const mockTransactions: Transaction[] = [
  { id: 't1', date: '2026-09-01', amount: 185000, type: 'income', categoryId: 'cat-salary', description: 'Зарплата за август' },
  { id: 't2', date: '2026-09-02', amount: 3200, type: 'expense', categoryId: 'cat-food', description: 'Ашан' },
  { id: 't3', date: '2026-09-02', amount: 450, type: 'expense', categoryId: 'cat-transport', description: 'Метро, проездной' },
  { id: 't4', date: '2026-09-03', amount: 25000, type: 'expense', categoryId: 'cat-housing', description: 'Аренда квартиры' },
  { id: 't5', date: '2026-09-04', amount: 1800, type: 'expense', categoryId: 'cat-entertainment', description: 'Кино с друзьями' },
  { id: 't6', date: '2026-09-05', amount: 15000, type: 'income', categoryId: 'cat-freelance', description: 'Проект на аутсорсе' },
  { id: 't7', date: '2026-09-05', amount: 2100, type: 'expense', categoryId: 'cat-food', description: 'Пятёрочка' },
  { id: 't8', date: '2026-09-06', amount: 4500, type: 'expense', categoryId: 'cat-health', description: 'Стоматолог' },
  { id: 't9', date: '2026-09-07', amount: 900, type: 'expense', categoryId: 'cat-transport', description: 'Такси' },
  { id: 't10', date: '2026-09-08', amount: 5000, type: 'income', categoryId: 'cat-gift', description: 'Подарок на день рождения' },
  { id: 't11', date: '2026-09-09', amount: 3800, type: 'expense', categoryId: 'cat-entertainment', description: 'Подписки, стриминг' },
  { id: 't12', date: '2026-09-10', amount: 2600, type: 'expense', categoryId: 'cat-food', description: 'Магнит' },
  { id: 't13', date: '2026-08-15', amount: 178000, type: 'income', categoryId: 'cat-salary', description: 'Зарплата за июль' },
  { id: 't14', date: '2026-08-18', amount: 24000, type: 'expense', categoryId: 'cat-housing', description: 'Аренда квартиры' },
  { id: 't15', date: '2026-08-20', amount: 9800, type: 'expense', categoryId: 'cat-food', description: 'Продукты за месяц' },
];

export function getRecentTransactions(limit = 5): Transaction[] {
  return [...mockTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
