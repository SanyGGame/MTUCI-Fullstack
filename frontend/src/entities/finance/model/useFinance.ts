import { useContext } from 'react';
import { FinanceContext } from './FinanceContext';

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance нужно использовать внутри FinanceProvider');
  return ctx;
}
