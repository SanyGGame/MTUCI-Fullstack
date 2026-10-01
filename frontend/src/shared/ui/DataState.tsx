import type { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import type { LoadStatus } from '../api/status';

interface DataStateProps {
  status: LoadStatus;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyHint?: string;
  emptyAction?: ReactNode;
  children: ReactNode;
}

export default function DataState({
  status,
  error,
  onRetry,
  isEmpty = false,
  emptyTitle = 'Данных пока нет',
  emptyHint,
  emptyAction,
  children,
}: DataStateProps) {
  if (status === 'loading') {
    return (
      <Box role="status" aria-label="Загрузка" sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Повторить
            </Button>
          )
        }
      >
        {error ?? 'Произошла ошибка'}
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <Fade in appear>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" gutterBottom>
            {emptyTitle}
          </Typography>
          {emptyHint && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {emptyHint}
            </Typography>
          )}
          {emptyAction}
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in appear timeout={400}>
      <Box>{children}</Box>
    </Fade>
  );
}
