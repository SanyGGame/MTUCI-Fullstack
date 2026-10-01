import type { Budget } from '../model/types';
import { simulateRequest } from '../../../shared/api/simulateRequest';

export const mockBudgets: Budget[] = [
  { id: 'b1', categoryId: 'cat-food', monthlyLimit: 25000 },
  { id: 'b2', categoryId: 'cat-transport', monthlyLimit: 1000 },
  { id: 'b3', categoryId: 'cat-housing', monthlyLimit: 25000 },
  { id: 'b4', categoryId: 'cat-entertainment', monthlyLimit: 8000 },
  { id: 'b5', categoryId: 'cat-health', monthlyLimit: 10000 },
];

export const fetchBudgets = () => simulateRequest(mockBudgets);
