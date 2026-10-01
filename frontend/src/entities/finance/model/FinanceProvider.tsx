import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { LoadStatus } from '../../../shared/api/status';
import { budgetApi, type Budget } from '../../budget';
import { categoryApi, type Category } from '../../category';
import { transactionApi, type Transaction } from '../../transaction';
import { summaryApi, type MonthlySummary } from '../api/summaryApi';
import { FinanceContext, type FinanceContextValue } from './FinanceContext';

interface Snapshot {
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  summary: MonthlySummary[];
}

async function loadAll(): Promise<Snapshot> {
  const [categories, transactions, budgets, summary] = await Promise.all([
    categoryApi.list(),
    transactionApi.list(),
    budgetApi.list(),
    summaryApi.list(),
  ]);
  return { categories, transactions, budgets, summary };
}

const errorText = (e: unknown) => (e instanceof Error ? e.message : 'Неизвестная ошибка');

export default function FinanceProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Snapshot>({ categories: [], transactions: [], budgets: [], summary: [] });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadAll()
      .then((snapshot) => {
        if (cancelled) return;
        setData(snapshot);
        setError(null);
        setStatus('ready');
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(errorText(e));
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const mutate = useCallback(async (action: () => Promise<unknown>) => {
    await action();
    try {
      setData(await loadAll());
    } catch (e) {
      setError(errorText(e));
      setStatus('error');
    }
  }, []);

  const value = useMemo<FinanceContextValue>(
    () => ({
      status,
      error,
      ...data,
      reload: () => {
        setStatus('loading');
        setReloadKey((k) => k + 1);
      },
      addTransaction: (d) => mutate(() => transactionApi.create(d)),
      updateTransaction: (id, d) => mutate(() => transactionApi.update(id, d)),
      deleteTransaction: (id) => mutate(() => transactionApi.remove(id)),
      addCategory: (d) => mutate(() => categoryApi.create(d)),
      updateCategory: (id, d) => mutate(() => categoryApi.update(id, d)),
      deleteCategory: (id) => mutate(() => categoryApi.remove(id)),
      addBudget: (d) => mutate(() => budgetApi.create(d)),
      updateBudget: (id, limit) => mutate(() => budgetApi.update(id, limit)),
      deleteBudget: (id) => mutate(() => budgetApi.remove(id)),
    }),
    [status, error, data, mutate],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}
