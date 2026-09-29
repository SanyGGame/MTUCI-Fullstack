import type { Budget } from '../types';

export const mockBudgets: Budget[] = [
  { id: 'b1', categoryId: 'cat-food', monthlyLimit: 25000, spent: 17600 },
  { id: 'b2', categoryId: 'cat-transport', monthlyLimit: 3000, spent: 4350 },
  { id: 'b3', categoryId: 'cat-housing', monthlyLimit: 25000, spent: 25000 },
  { id: 'b4', categoryId: 'cat-entertainment', monthlyLimit: 8000, spent: 5700 },
  { id: 'b5', categoryId: 'cat-health', monthlyLimit: 10000, spent: 4500 },
];
