import { useState } from 'react';

export function useSubmit() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (action: () => Promise<unknown>): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    try {
      await action();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось выполнить запрос');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, error, submit };
}
