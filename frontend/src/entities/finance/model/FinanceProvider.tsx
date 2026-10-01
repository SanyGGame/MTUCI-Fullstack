import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { LoadStatus } from '../../../shared/api/simulateRequest';
import { newId } from '../../../shared/lib/id';
import { fetchBudgets, type Budget } from '../../budget';
import { fetchCategories, type Category } from '../../category';
import { fetchTransactions, type Transaction } from '../../transaction';
import { FinanceContext, type FinanceContextValue } from './FinanceContext';

// Демо-версия
export default function FinanceProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchCategories(), fetchTransactions(), fetchBudgets()])
      .then(([c, t, b]) => {
        if (cancelled) return;
        setCategories(c);
        setTransactions(t);
        setBudgets(b);
        setError(null);
        setStatus('ready');
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Неизвестная ошибка');
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const value = useMemo<FinanceContextValue>(
    () => ({
      status,
      error,
      categories,
      transactions,
      budgets,
      reload: () => {
        setStatus('loading');
        setReloadKey((k) => k + 1);
      },
      addTransaction: (data) => {
        const category = categories.find((c) => c.id === data.categoryId);
        if (!category) return;
        setTransactions((prev) => [...prev, { ...data, id: newId(), type: category.type }]);
      },
      deleteTransaction: (id) => setTransactions((prev) => prev.filter((t) => t.id !== id)),
      addCategory: (data) => setCategories((prev) => [...prev, { ...data, id: newId() }]),
      addBudget: (data) => setBudgets((prev) => [...prev, { ...data, id: newId() }]),
    }),
    [status, error, categories, transactions, budgets],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}
