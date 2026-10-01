import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAuth } from '../../../entities/user';
import { useFormState } from '../../../shared/lib/useFormState';
import { hasErrors } from '../../../shared/lib/validation';
import { validateAuth, type AuthFormValues } from '../model/validate';

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/';
  const { values, setValue, touch, markSubmitted, visibleError } = useFormState<AuthFormValues>({
    email: '',
    password: '',
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === 'login';
  const errors = validateAuth(values, mode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    markSubmitted();
    if (hasErrors(errors)) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const creds = { email: values.email.trim(), password: values.password };
      await (isLogin ? login(creds) : register(creds));
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Не удалось выполнить запрос');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack spacing={1}>
        <Typography variant="h5" gutterBottom>
          {isLogin ? 'Вход' : 'Регистрация'}
        </Typography>
        {serverError && <Alert severity="error">{serverError}</Alert>}
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => setValue('email', e.target.value)}
          onBlur={() => touch('email')}
          error={!!visibleError(errors, 'email')}
          helperText={visibleError(errors, 'email') ?? ' '}
          autoFocus
        />
        <TextField
          label="Пароль"
          type="password"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          value={values.password}
          onChange={(e) => setValue('password', e.target.value)}
          onBlur={() => touch('password')}
          error={!!visibleError(errors, 'password')}
          helperText={visibleError(errors, 'password') ?? (isLogin ? ' ' : 'Не менее 8 символов')}
        />
        <Button type="submit" variant="contained" disableElevation disabled={submitting} size="large">
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </Button>
        <Typography variant="body2" sx={{ pt: 1, textAlign: 'center' }}>
          {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <Link component={RouterLink} to={isLogin ? '/register' : '/login'} state={{ from }}>
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </Link>
        </Typography>
      </Stack>
    </form>
  );
}
