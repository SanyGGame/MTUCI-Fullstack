import type { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import Grow from '@mui/material/Grow';

interface AppDialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function AppDialog({ open, onClose, children }: AppDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slots={{ transition: Grow }}
      slotProps={{ transition: { timeout: 300 } }}
    >
      {children}
    </Dialog>
  );
}
