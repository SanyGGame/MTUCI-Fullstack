import type { Category } from '../model/types';
import { simulateRequest } from '../../../shared/api/simulateRequest';

export const mockCategories: Category[] = [
  { id: 'cat-salary', name: 'Зарплата', type: 'income', color: '#2D5F4C' },
  { id: 'cat-freelance', name: 'Подработка', type: 'income', color: '#4C8069' },
  { id: 'cat-gift', name: 'Подарки', type: 'income', color: '#6FA189' },

  { id: 'cat-food', name: 'Продукты', type: 'expense', color: '#B8452F' },
  { id: 'cat-transport', name: 'Транспорт', type: 'expense', color: '#C97B4A' },
  { id: 'cat-housing', name: 'Жильё', type: 'expense', color: '#9C3B2E' },
  { id: 'cat-entertainment', name: 'Развлечения', type: 'expense', color: '#D19A6A' },
  { id: 'cat-health', name: 'Здоровье', type: 'expense', color: '#A65C4A' },
  { id: 'cat-other', name: 'Прочее', type: 'expense', color: '#8A8577' },
];

export const fetchCategories = () => simulateRequest(mockCategories);
