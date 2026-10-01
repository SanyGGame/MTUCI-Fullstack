import type { FormErrors } from '../../../shared/lib/validation';

export interface AuthFormValues {
  email: string;
  password: string;
}

export function validateAuth(v: AuthFormValues, mode: 'login' | 'register'): FormErrors<AuthFormValues> {
  const errors: FormErrors<AuthFormValues> = {};
  const email = v.email.trim();

  if (!email) errors.email = 'Введите email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Некорректный email';

  if (!v.password) errors.password = 'Введите пароль';
  else if (mode === 'register' && v.password.length < 8) errors.password = 'Не менее 8 символов';
  else if (v.password.length > 128) errors.password = 'Не более 128 символов';

  return errors;
}
