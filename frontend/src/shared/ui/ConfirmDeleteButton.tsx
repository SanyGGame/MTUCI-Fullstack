import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useSubmit } from '../lib/useSubmit';
import AppDialog from './AppDialog';
import { useNotify } from './useNotify';

interface Props {
  title: string;
  text: string;
  successMessage: string;
  ariaLabel: string;
  onConfirm: () => Promise<void>;
}

export default function ConfirmDeleteButton({ title, text, successMessage, ariaLabel, onConfirm }: Props) {
  const [open, setOpen] = useState(false);
  const { submitting, error, submit } = useSubmit();
  const notify = useNotify();

  const handleConfirm = async () => {
    if (await submit(onConfirm)) {
      notify(successMessage);
      setOpen(false);
    }
  };

  return (
    <>
      <IconButton size="small" aria-label={ariaLabel} onClick={() => setOpen(true)}>
        <DeleteOutlinedIcon fontSize="small" />
      </IconButton>
      <AppDialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button color="error" variant="contained" disableElevation disabled={submitting} onClick={handleConfirm}>
            Удалить
          </Button>
        </DialogActions>
      </AppDialog>
    </>
  );
}
