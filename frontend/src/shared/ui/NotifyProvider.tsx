import { useCallback, useMemo, useState, type ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { NotifyContext } from './NotifyContext';

export default function NotifyProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const notify = useCallback((text: string) => {
    setMessage(text);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotifyContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setOpen(false)}>
          {message}
        </Alert>
      </Snackbar>
    </NotifyContext.Provider>
  );
}
