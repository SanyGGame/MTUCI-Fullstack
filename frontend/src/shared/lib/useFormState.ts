import { useState } from 'react';
import type { FormErrors } from './validation';

export function useFormState<T extends object>(initial: T) {
  const [values, setValues] = useState<T>(initial);
  const [initialValues] = useState<T>(initial);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  return {
    values,
    setValue: <K extends keyof T>(key: K, value: T[K]) =>
      setValues((prev) => ({ ...prev, [key]: value })),
    touch: (key: keyof T) => setTouched((prev) => ({ ...prev, [key]: true })),
    markSubmitted: () => setSubmitted(true),
    visibleError: (errors: FormErrors<T>, key: keyof T) =>
      submitted || (touched[key] && values[key] !== initialValues[key]) ? errors[key] : undefined,
  };
}
